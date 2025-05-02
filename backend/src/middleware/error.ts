import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  errors?: ValidationError[];
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Handle validation errors
  if (err.errors) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(error => ({
        field: error.type,
        message: error.msg
      }))
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      error: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
      error: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: err.message
    });
  }

  // Handle custom API errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.code
    });
  }

  // Handle all other errors
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
}; 