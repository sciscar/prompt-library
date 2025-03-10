// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUkLXb0vrTfLUIysF_nz_BLYAEZXNEk6s",
    authDomain: "prompt-library-f3455.firebaseapp.com",
    projectId: "prompt-library-f3455",
    storageBucket: "prompt-library-f3455.firebasestorage.app",
    messagingSenderId: "629454256369",
    appId: "1:629454256369:web:f7a2ec22e440c5cf9f1150"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
