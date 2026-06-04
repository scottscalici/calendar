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

// --- PROJECT 2: New Database (Write/Read Notes) ---
const firebaseConfig = {
  apiKey: "AIzaSyAtGQHoI44yqVpmh8Ta2l2w6jjJJnL6Y3w",
  authDomain: "calendar-43052.firebaseapp.com",
  projectId: "calendar-43052",
  storageBucket: "calendar-43052.firebasestorage.app",
  messagingSenderId: "193599147167",
  appId: "1:193599147167:web:831139089beeb54989e6aa",
  measurementId: "G-9976XMZJ67"
};

// Initialize the original app instance
const originalApp = initializeApp(firebaseConfigOriginal);

// Initialize the new app instance (requires a unique name as the second argument)
const notesApp = initializeApp(firebaseConfigNotes, "notesApp");

// Get and export the separate Firestore instances
export const dbCalendar = getFirestore(originalApp);
export const dbNotes = getFirestore(notesApp);