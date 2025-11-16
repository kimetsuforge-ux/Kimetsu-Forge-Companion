import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // authDomain, storageBucket, etc. seriam necessários para uma integração completa,
    // mas estamos usando apenas o que foi fornecido no prompt.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
