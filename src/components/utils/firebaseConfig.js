// src/components/utils/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsk_bqMcb2eKlLWfIGmaXpzdV0Pw3MkLY",
    authDomain: "savoir-faire-ea320.firebaseapp.com",
    projectId: "savoir-faire-ea320",
    storageBucket: "savoir-faire-ea320.appspot.com",
    messagingSenderId: "952407774872",
    appId: "1:952407774872:web:bab4a0c237d086b548a2ed",
    measurementId: "G-CZVK7PFBHT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;
