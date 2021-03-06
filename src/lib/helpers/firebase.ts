import { initializeApp, FirebaseOptions, getApp, FirebaseApp } from 'firebase/app';

const config: FirebaseOptions = {
    apiKey: "AIzaSyAjLfhecwnZJyl-lv8FdXasQZGmYEEJ-wc",
    authDomain: "ada-handle-reserve.firebaseapp.com",
    databaseURL: "https://ada-handle-reserve-default-rtdb.firebaseio.com",
    projectId: "ada-handle-reserve",
    storageBucket: "ada-handle-reserve.appspot.com",
    messagingSenderId: "995478242710",
    appId: "1:995478242710:web:7b01129b47c6e82e1e49b7"
}

export const initializeFirebaseApp = (): FirebaseApp => {
    return initializeApp(config);
}