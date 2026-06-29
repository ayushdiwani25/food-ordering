import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPl4nqADJ8PSQwRA77IwSIRc_qyrh9k8Q",
  authDomain: "food-ordering-2ee08.firebaseapp.com",
  databaseURL: "https://food-ordering-2ee08-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "food-ordering-2ee08",
  storageBucket: "food-ordering-2ee08.firebasestorage.app",
  messagingSenderId: "813537694240",
  appId: "1:813537694240:web:a54c2457002b5427582245",
  measurementId: "G-B0CVX4TV2G",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;