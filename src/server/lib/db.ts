import mongoose from 'mongoose';
import { PlayerSessionModel } from '@numengames/numinia-models';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_APP_NAME}?retryWrites=true&w=majority`;

let isConnected: boolean;

export async function connectToDatabase() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('Could not connect to the database.');
    }
}

export { PlayerSessionModel };