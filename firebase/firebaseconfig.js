// firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMGDt2MQnHEJOI0dOK_ZknWaUUMYEZABk",
  authDomain: "startcap2-8598a.firebaseapp.com",
  projectId: "startcap2-8598a",
  storageBucket: "startcap2-8598a.appspot.com",
  messagingSenderId: "816574340851",
  appId: "1:816574340851:web:8df151975e3e8401fda186",
  measurementId: "G-KSH8FTK4F9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
