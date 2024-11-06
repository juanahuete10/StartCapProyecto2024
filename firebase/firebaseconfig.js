// firebaseconfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMGDt2MQnHEJOI0dOK_ZknWaUUMYEZABk",
  authDomain: "startcap2-8598a.firebaseapp.com",
  projectId: "startcap2-8598a",
  storageBucket: "startcap2-8598a",
  messagingSenderId: "816574340851",
  appId: "1:816574340851:web:8df151975e3e8401fda186",
  measurementId: "G-KSH8FTK4F9"
};

// Inicializar la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Auth con persistencia
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});