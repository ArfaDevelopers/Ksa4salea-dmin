// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpWI_HWbfKk6La4hG_ILEPXvgNj__NbyE",
  authDomain: "ksa4sale-classified.firebaseapp.com",
  projectId: "ksa4sale-classified",
  storageBucket: "ksa4sale-classified.firebasestorage.app",
  messagingSenderId: "909499598820",
  appId: "1:909499598820:web:2d2e057f79a6d1630969f1",
  measurementId: "G-J9L2V8EW22",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app); // Use getFirestore instead of firestore()

export { app, analytics };
