import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- PROJECT 1: Rename to firebaseConfigOriginal ---
const firebaseConfigOriginal = {
  apiKey: "AIzaSyCNjPpTu1g_8wc2sITS7M8Fqh7GZnueVKw",
  authDomain: "senorplus-1926c.firebaseapp.com",
  projectId: "senorplus-1926c",
  storageBucket: "senorplus-1926c.firebasestorage.app",
  messagingSenderId: "176067304584",
  appId: "1:176067304584:web:16346821442861c7f6533d",
  measurementId: "G-Z86KJRW25Q"
};

// --- PROJECT 2: Rename to firebaseConfigNotes ---
const firebaseConfigNotes = { 
  apiKey: "AIzaSyAtGQHoI44yqVpmh8Ta2l2w6jjJJnL6Y3w",
  authDomain: "calendar-43052.firebaseapp.com",
  projectId: "calendar-43052",
  storageBucket: "calendar-43052.firebasestorage.app",
  messagingSenderId: "193599147167",
  appId: "1:193599147167:web:831139089beeb54989e6aa",
  measurementId: "G-9976XMZJ67"
};

// 1. Initialize original app
const originalApp = initializeApp(firebaseConfigOriginal);

// 2. Initialize new app
const notesApp = initializeApp(firebaseConfigNotes, "notesApp");

// 3. Export
export const dbCalendar = getFirestore(originalApp);
export const dbNotes = getFirestore(notesApp);