import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUgtjwIbS-cH28cBKtCaNEhwW8y5B_kGM",
  authDomain: "rental-hub-1ea5b.firebaseapp.com",
  projectId: "rental-hub-1ea5b",
  storageBucket: "rental-hub-1ea5b.firebasestorage.app",
  messagingSenderId: "1033238356129",
  appId: "1:1033238356129:web:f479ffc45f25994305d0e0",
  measurementId: "G-VY3THL7BZ2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable local persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error", error);
});
