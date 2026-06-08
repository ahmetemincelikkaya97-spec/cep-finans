import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxOy3YfOzANQOdv8VZm9u_qJ-_7xog-p8",
  authDomain: "tadora-c2ef8.firebaseapp.com",
  projectId: "tadora-c2ef8",
  storageBucket: "tadora-c2ef8.firebasestorage.app",
  messagingSenderId: "887749447642",
  appId: "1:887749447642:web:3fcab9b42ab4408f10bae3",
  measurementId: "G-Z3JK5KDCJ0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
