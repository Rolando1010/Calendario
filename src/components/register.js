import { useState } from "react";
import { firebase, authentication } from "../firebase";
import { Redirect } from "react-router-dom";

import Toast from "./toast";

const Register = () => {
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getConfirmPassword, setConfirmPassword] = useState("");

    const [getShowToast, setShowToast] = useState(false);
    const [getTextToast, setTextToast] = useState();
    const [getSuccessToast, setSuccessToast] = useState();

    const [getEntry, setEntry] = useState();

    const register_google_user = async () => {
        let entry = false;
        const provider = new firebase.auth.GoogleAuthProvider();
        await authentication.signInWithPopup(provider).then(result=>{
            entry = true;
        }).catch(error=>{
            setSuccessToast(false);
            setTextToast(error.message);
            setShowToast(!getShowToast);
        });
        setEntry(entry);
    }

    const register_email_user = async (email, password) => {
        return await authentication.createUserWithEmailAndPassword(email, password);
    }

    const validate_register = async (event) => {
        event.preventDefault();
        var validate = true;
        if(!getEmail){
            validate = false;
            setTextToast("No dejes el campo de correo vacío");
        }
        if(!getPassword){
            validate = false;
            setTextToast("No dejes el campo de la contraseña vacío");
        }
        if(getPassword!==getConfirmPassword){
            validate = false;
            setTextToast("La contraseñas no coinciden");
        }
        setSuccessToast(validate);
        if(validate){
            await register_email_user(getEmail, getPassword).then(result=>{
                setEntry(true);
            }).catch(error=>{
                setSuccessToast(false);
                setTextToast(error.message);
            });
        }
        setShowToast(!getShowToast);
    }

    return (
        <div className="container-form mx-auto text-center rounded">
            <form onSubmit={validate_register}>
                <h3>Registro de Usuario</h3>
                <div className="input-group mb-3">
                    <span className="input-group-text">Correo</span>
                    <input type="email" className="form-control input" value={getEmail} onChange={(event)=>setEmail(event.target.value)} required/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Contraseña</span>
                    <input type="password" className="form-control input" autoComplete="on" value={getPassword} onChange={(event)=>setPassword(event.target.value)} required/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Confirmar Contraseña</span>
                    <input type="password" className="form-control input" autoComplete="on" value={getConfirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)} required/>
                </div>
                <button className="btn button mx-auto d-block">Registrarse</button>
            </form>
            <button className="btn button mx-auto d-block" onClick={register_google_user}>Registrarse con Google</button>
            <Toast text={getTextToast} success={getSuccessToast} show={getShowToast}/>
            {getEntry && <Redirect to="/calendario"/>}
        </div>
    );
}

export default Register;