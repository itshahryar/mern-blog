// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5dfe1.firebaseapp.com",
  projectId: "mern-blog-5dfe1",
  storageBucket: "mern-blog-5dfe1.appspot.com",
  messagingSenderId: "916552682232",
  appId: "1:916552682232:web:5565f2e82f0e286af0490d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
