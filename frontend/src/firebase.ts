// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA_nfOzpKVrP30Oap0MeJeDnevpcJpMhec",
  authDomain: "ecomm-react-ad4cb.firebaseapp.com",
  projectId: "ecomm-react-ad4cb",
  storageBucket: "ecomm-react-ad4cb.appspot.com",
  messagingSenderId: "164344831860",
  appId: "1:164344831860:web:9c23f594b911a32ba85621",
  measurementId: "G-JKF7B6LBF9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);