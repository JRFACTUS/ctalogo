import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpiNyAQ1XvNdlTsnh3A1fTMU1XYuET_ps",
  authDomain: "prueba-bbbc6.firebaseapp.com",
  databaseURL: "https://prueba-bbbc6-default-rtdb.firebaseio.com",
  projectId: "prueba-bbbc6",
  storageBucket: "prueba-bbbc6.appspot.com",
  messagingSenderId: "122803275558",
  appId: "1:122803275558:web:881e91776bf4bc7aa3a3e7",
  measurementId: "G-V0DZLFL8YF"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);