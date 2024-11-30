import { Request, Response } from 'express';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { sendEventsToClients } from '../utils/sseUtils';
import { generateResponse } from '../services/geminiService';
import { Chat } from '../models/models';

export const sendMessage = async (req: Request, res: Response) => {
  const { userId, message } = req.body;
  const file = req.file;

  try {
    let extractedText = '';
    if (file) {
      extractedText = await extractTextFromPDF(file.path);
    }

    const combinedMessage = extractedText ? `${message} ${extractedText}` : message;
    const responseText = await generateResponse(combinedMessage);

    const newChat = new Chat({ userId, message: combinedMessage, response: responseText });
    await newChat.save();

    const replyMessage = { userId, message: combinedMessage, response: responseText };
    sendEventsToClients(replyMessage);

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Error processing the request' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const chatHistory = await Chat.find().sort({ createdAt: 1 });
    chatHistory.forEach(chat => {
        const message = { userId: chat.userId, message: chat.message, response: chat.response };
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      });
    sendEventsToClients({ message: 'Connected to real-time updates' });
  } catch (error:any) {
    console.error('Error fetching chat history:', error);
  }

  req.on('close', () => {
    res.end();
  });
};

export const clearChatHistory = async (_req: Request, res: Response) => {
  try {
    await Chat.deleteMany({});
    sendEventsToClients({ message: 'Chat history cleared' });
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Error clearing chat history' });
  }
};