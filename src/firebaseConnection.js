import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRIY9z_EX-x73J_gVjhcWwag7XLG1Fg9g",
  authDomain: "curso-fullstack-pro.firebaseapp.com",
  projectId: "curso-fullstack-pro",
  storageBucket: "curso-fullstack-pro.appspot.com",
  messagingSenderId: "985068799185",
  appId: "1:985068799185:web:0beb2119f7cd639ca331f0",
  measurementId: "G-5XK3G96YY8",
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
