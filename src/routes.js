import { useState } from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";

import Menu from "./components/menu";
import Login from "./components/login";
import Register from "./components/register";
import { authentication } from "./firebase";
import Calendar from "./components/calendar";

const App = () => {
    const [getIsAuth, setIsAuth] = useState();

    authentication.onAuthStateChanged(user=>{
        user ? setIsAuth(true) : setIsAuth(false);
    });

    return (
        <Router>
            <Menu/>
            <Route exact path="/">
                <Login/>
            </Route>
            <Route path="/inicio_sesion">
                <Login/>
            </Route>
            <Route path="/registro">
                <Register/>
            </Route>
            <Route path="/calendario">
                {getIsAuth && <Calendar/>}
                {getIsAuth===false && <Redirect to="/inicio_sesion"/>}
            </Route>
        </Router>
    );
}

export default App;