import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import Routes
import authRoutes from './routes/authRoutes';
import soilRoutes from './routes/soilRoutes';
import cropRoutes from './routes/cropRoutes';
import diseaseRoutes from './routes/diseaseRoutes';
import calendarRoutes from './routes/calendarRoutes';
import chatRoutes from './routes/chatRoutes';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({
  origin: '*', // Allows clean frontend testing connection
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Static Assets Directory
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// API Routing Namespace Wiring
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/soil', soilRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/diseases', diseaseRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/chatbot', chatRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 AgriSol Backend Live on Port: ${PORT}`);
  console.log(`📂 Uploads directory: ${uploadsDir}`);
  console.log(`=========================================`);
});
