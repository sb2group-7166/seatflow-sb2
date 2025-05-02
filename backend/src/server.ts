import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';
import { config } from './config';

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 