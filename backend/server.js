import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import aiRouter from './routes/ai.js';
import questionsRouter from './routes/questions.js';
import adminRouter from './routes/admin.js';
import profileRouter from './routes/profile.js';
import progressRouter from './routes/progress.js';
import academicRouter from './routes/academic.js';

const app = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json({ limit: '50kb' }));
app.use(generalRateLimiter);

// Health check — used by Render.com and local verification
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

app.use('/api/ai', aiRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/profile', profileRouter);
app.use('/api/progress', progressRouter);
app.use('/api/academic', academicRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
