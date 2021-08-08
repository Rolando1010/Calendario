import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: proccess.env.apiKey,
    authDomain: proccess.env.authDomain,
    projectId: proccess.env.projectId,
    storageBucket: proccess.env.storageBucket,
    messagingSenderId: proccess.env.messagingSenderId,
    appId: proccess.env.appId
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseDB = firebaseApp.firestore();
const authentication = firebaseApp.auth();

export {
    firebase,
    firebaseDB,
    authentication
}
