import firebase from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyBReGS8fdZyrNaBPqiOw1pNelHg3pPk0jc",
    authDomain: "tenedores-1def9.firebaseapp.com",
    projectId: "tenedores-1def9",
    storageBucket: "tenedores-1def9.appspot.com",
    messagingSenderId: "380324133049",
    appId: "1:380324133049:web:32e05d41eedc1e46ea8368"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);