import { useState } from "react";
import { firebase, authentication } from "../firebase";
import { Redirect } from "react-router-dom";

import Toast from "./toast";

const Login = () => {
    const [getEmail, setEmail] = useState("");
    const [getPassword, setPassword] = useState("");

    const [getShowToast, setShowToast] = useState(false);
    const [getTextToast, setTextToast] = useState();
    const [getSuccessToast, setSuccessToast] = useState();

    const [getEntry, setEntry] = useState();

    const login_google_user = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        let entry = false;
        await authentication.signInWithPopup(provider).then(result=>{
            entry = true;
        }).catch(error=>{
            setSuccessToast(false);
            setTextToast(error.message);
            setShowToast(!getShowToast);
        });
        setEntry(entry);
    }

    const login_email_user = async (email, password) => {
        return await authentication.signInWithEmailAndPassword(email, password);
    }

    const validate_login = async (event) => {
        event.preventDefault();
        let validate = true;
        if(!getEmail){
            validate = false;
            setTextToast("No dejes el campo de correo vacío");
        }
        if(!getPassword){
            validate = false;
            setTextToast("No dejes el campo de contraseña vacío");
        }
        setSuccessToast(validate);
        if(validate){
            await login_email_user(getEmail, getPassword).then(userCredential=>{
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
            <form onSubmit={validate_login}>
                <h3>Inicio de Sesión</h3>
                <div className="input-group mb-3">
                    <span className="input-group-text">Correo</span>
                    <input type="email" className="form-control input" value={getEmail} onChange={(event)=>setEmail(event.target.value)} required/>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">Contraseña</span>
                    <input type="password" className="form-control input" autoComplete="on" value={getPassword} onChange={(event)=>setPassword(event.target.value)} required/>
                </div>
                <button className="btn button mx-auto d-block">Iniciar Sesión</button>
            </form>
            <button className="btn button mx-auto d-block" onClick={login_google_user}>Iniciar Sesión con Google</button>
            <Toast text={getTextToast} success={getSuccessToast} show={getShowToast}/>
            {getEntry && <Redirect to="/calendario"/>}
        </div>
    );
}

export default Login;