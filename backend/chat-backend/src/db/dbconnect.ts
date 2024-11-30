import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sinanadoor:Sinan%40123@cluster1.w5xhc.mongodb.net/Chat?retryWrites=true&w=majority');   
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; 
      }
  };