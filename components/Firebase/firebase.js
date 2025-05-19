// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCpWI_HWbfKk6La4hG_ILEPXvgNj__NbyE",
//   authDomain: "ksa4sale-classified.firebaseapp.com",
//   projectId: "ksa4sale-classified",
//   storageBucket: "ksa4sale-classified.firebasestorage.app",
//   messagingSenderId: "909499598820",
//   appId: "1:909499598820:web:2d2e057f79a6d1630969f1",
//   measurementId: "G-J9L2V8EW22",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAYAEn8EaP9hiKbvqkZjTCz2IbYJys9ZCM",
  authDomain: "ksa4sale-f0388.firebaseapp.com",
  projectId: "ksa4sale-f0388",
  storageBucket: "ksa4sale-f0388.firebasestorage.app",
  messagingSenderId: "494758410258",
  appId: "1:494758410258:web:a1fdadfa4df6e0f87700cb",
  measurementId: "G-5CDR4XPRYT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
