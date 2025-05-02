import { Document } from 'mongoose';
import { Request } from 'express';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest<P = {}, ResBody = {}, ReqBody = {}> extends Request<P, ResBody, ReqBody> {
  user?: {
    _id: string;
    role: string;
  };
}

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'staff' | 'user';
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
  profileImage?: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
} 