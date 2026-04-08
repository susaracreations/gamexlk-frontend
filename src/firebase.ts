import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5ST3LWcob0b68B2kG4dJaG1UMuaYBs3I",
  authDomain: "gamexlk.firebaseapp.com",
  projectId: "gamexlk",
  storageBucket: "gamexlk.firebasestorage.app",
  messagingSenderId: "847088911827",
  appId: "1:847088911827:web:1f697cfe953d3767f99b26",
  measurementId: "G-0VEF2KG3EN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);