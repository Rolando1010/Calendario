import { useState } from "react";
import { authentication } from "../firebase";

const Menu = () => {
    const [getIsAuth, setIsAuth] = useState();

    authentication.onAuthStateChanged(user=>{
        user ? setIsAuth(true) : setIsAuth(false);
    });

    const logout = () => {
        authentication.signOut();
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark menu">
            <div className="container-fluid">
                <a className="navbar-brand">Calendario de Trabajo</a>
                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {getIsAuth &&
                            <li className="nav-item element-menu">
                                <a className="nav-link" href="/#/calendario">Calendario</a>
                            </li>
                        }
                    </ul>
                    { getIsAuth &&
                        <ul className="navbar-nav navbar-text">
                            <li className="nav-item element-menu">
                                <a className="nav-link" href="" onClick={logout}>Cerrar Sesión</a>
                            </li>
                        </ul>
                    }
                    { getIsAuth===false && 
                        <ul className="navbar-nav navbar-text">
                            <li className="nav-item element-menu">
                                <a className="nav-link" href="/#/inicio_sesion">Iniciar Sesión</a>
                            </li>
                            <li className="nav-item element-menu">
                                <a className="nav-link" href="/#/registro">Regístrate</a>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </nav>
    );
}

export default Menu;