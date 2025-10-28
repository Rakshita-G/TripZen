// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  // apiKey: "AIzaSyBLtuliEkAqGXSe5RoZUFj1hJSkMI9U-CQ",
  // authDomain: "ai-trip-planner-b16ba.firebaseapp.com",
  // projectId: "ai-trip-planner-b16ba",
  // storageBucket: "ai-trip-planner-b16ba.appspot.com",
  // messagingSenderId: "654419959827",
  // appId: "1:654419959827:web:ab457688f1e234fe0f1fe6",
  // measurementId: "G-DS3935ZN33"

  apiKey: "AIzaSyAI6W-URRICP44hU7YdyPItx5cGFpD_oYg",
  authDomain: "trip-zen-1b65b.firebaseapp.com",
  projectId: "trip-zen-1b65b",
  storageBucket: "trip-zen-1b65b.appappspot.com",
  messagingSenderId: "861737295006",
  appId: "1:861737295006:web:476704ac16d42f72cfef8f",
  measurementId: "G-78BXRGN518"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);