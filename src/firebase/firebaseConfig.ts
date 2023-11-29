
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAhgk_Iw1XtYseC4OvrQNUEcQXbIrUzMT4",
    authDomain: "movie-app-a0637.firebaseapp.com",
    projectId: "movie-app-a0637",
    storageBucket: "movie-app-a0637.appspot.com",
    messagingSenderId: "143190129367",
    appId: "1:143190129367:web:61984f292a3703ef8d0e92",
    measurementId: "G-X128F93B12"
};



const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);



export { app, db, };