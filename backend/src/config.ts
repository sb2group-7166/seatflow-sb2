import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiration: string;
  nodeEnv: string;
  corsOrigin: string;
  rateLimitWindow: number;
  rateLimitMax: number;
  backupDir: string;
  logDir: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/seatflow',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  backupDir: process.env.BACKUP_DIR || 'backups',
  logDir: process.env.LOG_DIR || 'logs'
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export { config }; 