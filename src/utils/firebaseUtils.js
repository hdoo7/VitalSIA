import { db } from './firebase'; // Ensure this path correctly points to your Firebase config file

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