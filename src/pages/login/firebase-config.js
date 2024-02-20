import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCH3YyTiFgMnetNtZAjTrFNcy7Zz233Qa8",
  authDomain: "surc-26fb4.firebaseapp.com",
  projectId: "surc-26fb4",
  storageBucket: "surc-26fb4.appspot.com",
  messagingSenderId: "714032656351",
  appId: "1:714032656351:web:d0c8992cc8dd2b76e75e6a",
  measurementId: "G-01Q5DMR25D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
