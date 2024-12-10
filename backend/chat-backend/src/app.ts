import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';
import { connectDB } from './db/dbconnect';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/chat', chatRoutes);

// Database connection
connectDB();


export default app;
