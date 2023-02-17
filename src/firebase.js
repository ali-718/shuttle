// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyBKP7mny2eJ_ay2nLugBdOIS5YEER7sFPI',
  authDomain: 'shuttle-inventory.firebaseapp.com',
  projectId: 'shuttle-inventory',
  storageBucket: 'shuttle-inventory.appspot.com',
  messagingSenderId: '187828286272',
  appId: '1:187828286272:web:f36d83e4fbbba4c8e780a5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);