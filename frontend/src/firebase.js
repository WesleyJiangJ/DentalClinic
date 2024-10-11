// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiURL = import.meta.env;
const firebaseConfig = {
    apiKey: apiURL.VITE_API_KEY,
    authDomain: apiURL.VITE_AUTH_DOMAIN,
    projectId: apiURL.VITE_PROJECT_ID,
    storageBucket: apiURL.VITE_STORAGE_BUCKET,
    messagingSenderId: apiURL.VITE_MESSAGING_SENDER_ID,
    appId: apiURL.VITE_APP_ID,
    measurementId: apiURL.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };