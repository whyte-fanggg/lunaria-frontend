// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7z6ysGiAEU_Fc16psapYlkaOnaVkUrwA",
  authDomain: "lunaria-319f6.firebaseapp.com",
  projectId: "lunaria-319f6",
  storageBucket: "lunaria-319f6.firebasestorage.app",
  messagingSenderId: "628161136517",
  appId: "1:628161136517:web:f8d5570d8a27f67dc4a6ec"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
