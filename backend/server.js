import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API healthy and running' });
});

app.listen(PORT, () => {
  console.log(`[Server] Live on port ${PORT}`);
});