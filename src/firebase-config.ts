import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBVGnZvxGH3gdOlHjGNxSg6ndjN8fNcd-A",
    authDomain: "trip-planner-94b03.firebaseapp.com",
    projectId: "trip-planner-94b03",
    storageBucket: "trip-planner-94b03.firebasestorage.app",
    messagingSenderId: "671433014392",
    appId: "1:671433014392:web:319e74d42129d0466b818d",
    measurementId: "G-LJZQHVYL6Z"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export { addDoc, collection };