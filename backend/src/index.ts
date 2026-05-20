import express, { Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { config } from './config/index.js';
import { initializeDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import scheduleRoutes from './routes/schedules.js';
import unitRoutes from './routes/units.js';

const app = express();

// Middleware
app.use(cors({ origin: config.server.frontendUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/units', unitRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling
app.use(
  (err: any, req: Request, res: Response) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
);

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${config.server.nodeEnv}`);
});
