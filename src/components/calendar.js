import { useEffect, useState } from "react";
import { firebaseDB } from "../firebase";
import Toast from "./toast";
import { authentication } from "../firebase";

const Calendar = () => {
    const [getShowToast, setShowToast] = useState(false);
    const [getTextToast, setTextToast] = useState();
    const [getSuccessToast, setSuccessToast] = useState();

    const generate_days_calendar = (num_month, year) => {
        const num_days = new Date(year, num_month, 0).getDate();
        const firstDayMonth = new Date(`${num_month}-1-${year}`);
        let numWeekDay = firstDayMonth.getDay();
        if(!numWeekDay){
            numWeekDay = 7;
        }
        const days = [];
        if (numWeekDay !== 1) {
            const prevYear = (num_month === 1 ? year - 1 : year);
            const prevMonth = (num_month === 1 ? 12 : num_month - 1);
            const daysPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
            for (let i = numWeekDay - 2; i >= 0; i--) {
                days.push({ date: new Date(`${prevMonth}-${daysPrevMonth - i}-${prevYear}`), num_day: daysPrevMonth - i, enabled: false });
            }
        }
        for (let i = 1; i <= num_days; i++) {
            days.push({ date: new Date(`${num_month}-${i}-${year}`), num_day: i, enabled: true });
        }
        for (let i = 1; days.length % 7 !== 0; i++) {
            days.push({ date: new Date(`${num_month === 12 ? 1 : num_month + 1}-${i}-${num_month === 12 ? year + 1 : year}`), num_day: i, enabled: false });
        }
        return days;
    }

    const months_name = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const getActualYear = () => {
        const actualDate = new Date();
        return actualDate.getFullYear();
    }

    const getActualMonth = () => {
        const actualDate = new Date();
        return actualDate.getMonth();
    }
    
    const [getMonth, setMonth] = useState(getActualMonth());
    const [getYear, setYear] = useState(getActualYear());

    const [getDays, setDays] = useState(generate_days_calendar(getActualMonth() + 1, getActualYear()));

    const change_month = (event) => {
        const date = (event.target.value).split("-");
        const year = parseInt(date[0]);
        const num_month = parseInt(date[1]);
        setMonth(num_month - 1);
        setYear(year);
        const days = generate_days_calendar(num_month, year);
        setDays(days);
    }

    const [getColorCategory, setColorCategory] = useState("#000000");
    const [getNameCategory, setNameCategory] = useState("");

    const create_category = async (event) => {
        event.preventDefault();
        setSuccessToast(false);
        if (!getNameCategory) {
            setTextToast("Escribe un nombre para la categoría, por favor");
        }
        else if (getCategories.filter(category => category.name === getNameCategory).length) {
            setTextToast("Ya ingresaste este nombre para otra categoría, selecciona uno nuevo");
        }
        else if (getCategories.filter(category => category.color === getColorCategory).length) {
            setTextToast("Ya seleccionaste este color para otra categoría, selecciona uno nuevo");
        }
        else {
            await firebaseDB.collection("categories").doc().set({ color: getColorCategory, name: getNameCategory, id_user: authentication.currentUser.uid }).then(result => {
                setColorCategory("#000000");
                setNameCategory("");
                setSuccessToast(true);
                setTextToast("Categoría añadida exitosamente");
            }).catch(error => {
                setTextToast(`Error: ${error.message}`);
            });
        }
        setShowToast(!getShowToast);
    }

    const [getCategories, setCategories] = useState([]);

    const loadCategories = () => {
        firebaseDB.collection("categories").onSnapshot((querySnapshot) => {
            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push({ ...doc.data(), id: doc.id });
            });
            setCategories(categories.filter(category=>category.especial || category.id_user===authentication.currentUser.uid));
        });
    }

    const [getCategoriesDates, setCategoriesDates] = useState([]);

    const loadCategoriesDates = () => {
        firebaseDB.collection("categoriesDates").onSnapshot((querySnapshot) => {
            const categoriesDates = [];
            querySnapshot.forEach((doc) => {
                categoriesDates.push({ ...doc.data(), id: doc.id });
            });
            setCategoriesDates(categoriesDates.map(cd => {
                cd.date = cd.date.toDate();
                return cd;
            }));
        });
    }

    useEffect(() => {
        loadCategories();
        loadCategoriesDates();
    }, [])

    const [getSelectedCategory, setSelectedCategory] = useState();

    const selectCategory = (id_category) => {
        if (getSelectedCategory === id_category) {
            setSelectedCategory(undefined);
        } else {
            setSelectedCategory(id_category);
        }
    }

    const asignCategoryToDate = (date) => {
        let prevCD = getCategoriesDates.filter(cd => cd.id_category === getSelectedCategory && String(cd.date) === String(date.date))[0];
        if(prevCD){
            if(prevCD.id_user){
                prevCD = getCategoriesDates.filter(cd=>cd.id_category === getSelectedCategory && String(cd.date) === String(date.date) && cd.id_user===authentication.currentUser.uid)[0];
            }
        }
        if (prevCD) {
            firebaseDB.collection("categoriesDates").doc(prevCD.id).delete().then(result => {
                setSuccessToast(true);
                setTextToast("Categoría desligada de la fecha seleccionada");
                setShowToast(!getShowToast);
            }).catch(error => {
                setSuccessToast(false);
                setTextToast(`Error: ${error}`);
                setShowToast(!getShowToast);
            });
        }
        else if (!date.enabled) {
            setSuccessToast(false);
            setTextToast("Esa fecha no está dentro del mes seleccionado");
            setShowToast(!getShowToast);
        }
        else if (!getSelectedCategory) {
            setSuccessToast(false);
            setTextToast("Por favor selecciona una categoría");
            setShowToast(!getShowToast);
        }
        else {
            const categoryDate = {
                id_category: getSelectedCategory,
                date: date.date
            }
            if(getCategories.filter(category=>category.id===getSelectedCategory)[0].especial){
                categoryDate.id_user = authentication.currentUser.uid;
            }
            firebaseDB.collection("categoriesDates").doc().set({
                ...categoryDate
            }).then((result) => {
                setSuccessToast(true);
                setTextToast("Categoría asignada");
                setShowToast(!getShowToast);
            }).catch((error) => {
                setSuccessToast(false);
                setTextToast(`Error: ${error.message}`);
                setShowToast(!getShowToast);
            });
        }
    }

    const splitMonthDaysInWeeks = (days) => {
        const weeks = [];
        let week = [];
        for (let i = 0; i <= days.length; i++) {
            if ((i % 7 === 0 || i === days.length) && i !== 0) {
                weeks.push(week);
                week = [];
            }
            week.push(days[i]);
        }
        return weeks;
    }

    const deleteCategoriesDatesCategory = (id_category) => {
        getCategoriesDates.map(cd=>{
            if(cd.id_category===id_category){
                firebaseDB.collection("categoriesDates").doc(cd.id).delete();
            }
        });
    }

    const deleteCategory = (id_category) => {
        if(getCategories.filter(category=>category.id===id_category && category.especial).length){
            setSuccessToast(false);
            setTextToast("Esta categoría no puede ser eliminada");
            setShowToast(!getShowToast);
        }else{
            deleteCategoriesDatesCategory(id_category);
            firebaseDB.collection("categories").doc(id_category).delete().then(result=>{
                setSuccessToast(true);
                setTextToast("Categoría eliminada");
                setShowToast(!getShowToast);
            }).catch(error=>{
                setSuccessToast(false);
                setTextToast(`Error: ${error.message}`);
                setShowToast(!getShowToast);
            });
        }
    }

    const moveMonth = (month, year) => {
        setMonth(month);
        setYear(year);
        setDays(generate_days_calendar(month+1, year));
    }

    return (
        <div>
            <div className="row g-0">
                <div className="col-md-4 container-control-panel">
                    <div className="control-panel">
                        <h3 className="title-control-panel text-center">Categorías</h3>
                        <div className="body-control-panel text-center">
                            <label className="form-label mr-20">Selecciona un mes:</label>
                            <input onChange={change_month} type="month" value={`${getYear}-${getMonth<9 ? "0"+(getMonth+1) :getMonth+1}`}/>
                            <form onSubmit={create_category}>
                                <div className="row g-0 mt-10">
                                    <div className="col-3">
                                        <input value={getColorCategory} onChange={(event) => setColorCategory(event.target.value)} type="color" className="form-control form-control-color mx-auto w-90" title="Escoge un color para asignar a tu nueva categoría" />
                                    </div>
                                    <div className="col-9">
                                        <input value={getNameCategory} onChange={(event) => setNameCategory(event.target.value)} type="text" className="form-control mx-auto w-90" placeholder="Nombre de Categoria" required />
                                    </div>
                                </div>
                                <button className="btn btn-create-category w-90 mv-10">Crear Categoría</button>
                            </form>
                        </div>
                        <ul className="list-group container-categories">
                            {getCategories.map(category => {
                                return (
                                    <li key={category.id} onClick={() => selectCategory(category.id)} className={getSelectedCategory === category.id ? "category list-group-item d-flex justify-content-between align-items-center category-selected" : "category list-group-item d-flex justify-content-between align-items-center"}>
                                            <div>
                                                <span className="badge rounded-pill mr-20" style={{ backgroundColor: category.color }}>{category.name[0]}</span>
                                                {category.name}
                                            </div>
                                            { !category.especial && <i onClick={()=>deleteCategory(category.id)} title="Eliminar Categoría" className="fas fa-times-circle btn-delete-category"></i> }
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-md-8 calendar-container">
                    <table className="calendar">
                        <thead>
                            <tr>
                                <th colSpan="7 text-center">
                                    <div className="row g-0 mt-10">
                                        <div className="col-2">
                                        <div className="arrow-calendar f-l">
                                                <i onClick={()=>moveMonth(getMonth,getYear-1)} title="Retroceder un año" className="fas fa-chevron-double-left"></i>
                                                <i onClick={()=>moveMonth(getMonth===0 ? 11 : getMonth-1 , getMonth===0 ? getYear-1 : getYear)} title="Retroceder un mes" className="far fa-chevron-left"></i>
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <h3 className="month text-center">{months_name[getMonth]} {getYear}</h3>
                                        </div>
                                        <div className="col-2">
                                            <div className="arrow-calendar f-r">
                                                <i onClick={()=>moveMonth(getMonth===11 ? 0 : getMonth+1 , getMonth===11 ? getYear+1 : getYear)} title="Avanzar un mes" className="far fa-chevron-right"></i>
                                                <i onClick={()=>moveMonth(getMonth,getYear+1)} title="Avanzar un año" className="fas fa-chevron-double-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr className="week-days text-center">
                                <th>Lunes</th>
                                <th>Martes</th>
                                <th>Miércoles</th>
                                <th>Jueves</th>
                                <th>Viernes</th>
                                <th>Sábado</th>
                                <th>Domingo</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {splitMonthDaysInWeeks(getDays).map((week) => {
                                return (
                                    <tr key={week[0].num_day}>
                                        {week.map(day => {
                                            return (
                                                <td key={day.date} onClick={() => asignCategoryToDate(day)} className={!day.enabled ? "day-disabled day" : "day"} style={getSelectedCategory && day.enabled ? { cursor: "pointer" } : {}}>
                                                    {day.num_day}
                                                    <div className="categories-Date">
                                                        {day.enabled && getCategoriesDates.filter(cd => String(cd.date) === String(day.date)).map(cd => {
                                                            const category = getCategories.filter(category => category.id === cd.id_category)[0];
                                                            if(category && ((category.especial && cd.id_user===authentication.currentUser.uid) || !category.especial)){
                                                                return (
                                                                    <div key={`${category.id}-${day.date}`}>
                                                                        <span className="badge rounded-pill" style={{ backgroundColor: category.color }}>{category.name[0]}</span>
                                                                    </div>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toast text={getTextToast} success={getSuccessToast} show={getShowToast} styleAdapter={true} />
        </div>
    );
}

export default Calendar;