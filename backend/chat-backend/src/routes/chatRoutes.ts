import express from 'express';
import multer from 'multer';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chatController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/send', upload.single('file'), sendMessage);
router.get('/events', getChatHistory);
router.delete('/clear', clearChatHistory);

export default router;
