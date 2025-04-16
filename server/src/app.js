import express from 'express';
import apiKeyRoutes from './routes/apiKeys.route.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use(`/api/api-keys`, apiKeyRoutes);
app.use(`/api/auth`, authRoutes);

export default app;