import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXX",
    projectId: "XXXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXXXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXX"
};

console.log("FirebaseConfig:",firebaseConfig);

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseDB = firebaseApp.firestore();
const authentication = firebaseApp.auth();

export {
    firebase,
    firebaseDB,
    authentication
}
