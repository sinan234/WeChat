import { Request, Response } from 'express';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { sendEventsToClients } from '../utils/sseUtils';
import {  fetchProducts, searchProduct } from '../services/productService';
import { Chat } from '../models/models';
import { RagService } from '../services/ragService';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { userId, message } = req.body;
  const file = req.file;
  try {
    let context = '';

    if (file) {
      const ragSystem = new RagService();

      context = await ragSystem.processQuery(file.path, message);   
      console.log("context",context)
    } else {
      const products = await fetchProducts();

      const matchedProduct = searchProduct(message, products);

      if (matchedProduct) {
       context = `Product: ${matchedProduct.title}\nDescription: ${matchedProduct.description}\nPrice: ${matchedProduct.price}\nCategory: ${matchedProduct.category}`;
     }
    }

    if (!context) {
      res.status(404).json({ error: 'No relevant data found for the query' });
      return;
    }


    const newChat = new Chat({
      userId,
      message,
      context,
      response:  context,
    });
    
    await newChat.save();

    res.json({ reply: context });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'No data relevant for your query' });
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
