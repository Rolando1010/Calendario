import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyD52qwezdfMQJxQD8aCfLdCLuVbajY14yY",
    authDomain: "db-work-calendar-c825f.firebaseapp.com",
    projectId: "db-work-calendar-c825f",
    storageBucket: "db-work-calendar-c825f.appspot.com",
    messagingSenderId: "487115116285",
    appId: "1:487115116285:web:2cf1793a4b3d166e523894"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseDB = firebaseApp.firestore();
const authentication = firebaseApp.auth();

export {
    firebase,
    firebaseDB,
    authentication
}