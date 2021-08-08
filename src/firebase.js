import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
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
