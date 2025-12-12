// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC1CZuAVmbRYO72jjkV78H5lfNXnGvpAPQ",
  authDomain: "romstud-feedback.firebaseapp.com",
  projectId: "romstud-feedback",
  storageBucket: "romstud-feedback.firebasestorage.app",
  messagingSenderId: "847586133366",
  appId: "1:847586133366:web:f9da388a895e22ac81e657"
};

// Inițializăm Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);