import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import aiRouter from './routes/ai.js';
import questionsRouter from './routes/questions.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '50kb' }));
app.use(generalRateLimiter);

// Health check — used by Render.com and local verification
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.use('/api/ai', aiRouter);
app.use('/api/questions', questionsRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
