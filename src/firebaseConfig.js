// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNjPpTu1g_8wc2sITS7M8Fqh7GZnueVKw",
  authDomain: "senorplus-1926c.firebaseapp.com",
  projectId: "senorplus-1926c",
  storageBucket: "senorplus-1926c.firebasestorage.app",
  messagingSenderId: "176067304584",
  appId: "1:176067304584:web:16346821442861c7f6533d",
  measurementId: "G-Z86KJRW25Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);