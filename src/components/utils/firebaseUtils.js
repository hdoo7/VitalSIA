// firebaseUtils.js
import db from './firebaseConfig'; // Ensure the correct path to your Firebase configuration

export const saveToFirebase = async (collectionName, data, toast) => {
    try {
        await db.collection(collectionName).add({
            ...data,
            createdAt: new Date() // Timestamp for when the entry is created
        });
        toast({
            title: 'Data Saved',
            description: 'Your data has been successfully saved to Firestore.',
            status: 'success',
            duration: 5000,
            isClosable: true
        });
    } catch (error) {
        console.error('Failed to save data to Firestore:', error);
        toast({
            title: 'Error',
            description: 'Failed to save data. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true
        });
    }
};
