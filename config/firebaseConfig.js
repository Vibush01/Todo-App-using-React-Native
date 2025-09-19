import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5EyRwDPuYcEADkwUiB6eT7LAMgKtO_WA",
  authDomain: "todoapp-945c0.firebaseapp.com",
  projectId: "todoapp-945c0",
  storageBucket: "todoapp-945c0.firebasestorage.app",
  messagingSenderId: "1062878643344",
  appId: "1:1062878643344:web:307b74c09a8b571e78c415"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});