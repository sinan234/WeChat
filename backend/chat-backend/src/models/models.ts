import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},{ timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);
