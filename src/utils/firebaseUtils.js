import { db } from '../firebaseConfig'; // Adjust the path as needed if your Firebase config is elsewhere


export const saveToFirebase = async (collectionName, data) => {
    try {
        await db.collection(collectionName).add({
            ...data,
            createdAt: new Date() // Timestamp for when the entry is created
        });
        console.log('Data saved successfully to Firestore.');
    } catch (error) {
        console.error('Failed to save data to Firestore:', error);
    }
};
