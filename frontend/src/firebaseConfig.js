// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUkLXb0vrTfLUIysF_nz_BLYAEZXNEk6s",
  authDomain: "prompt-library-f3455.firebaseapp.com",
  projectId: "prompt-library-f3455",
  storageBucket: "prompt-library-f3455.firebasestorage.app",
  messagingSenderId: "629454256369",
  appId: "1:629454256369:web:f7a2ec22e440c5cf9f1150",
  measurementId: "G-CEBFJBLXX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);