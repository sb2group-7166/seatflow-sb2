import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { 
  AuthRequest, 
  ApiError, 
  RegisterBody, 
  LoginBody, 
  UpdateProfileBody, 
  ChangePasswordBody 
} from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const err = error as ApiError;
    res.status(500).json({ 
      message: 'Error registering user', 
      error: err.message 
    });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const err = error as ApiError;
    res.status(500).json({ 
      message: 'Error logging in', 
      error: err.message 
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    const err = error as ApiError;
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: err.message 
    });
  }
};

export const updateProfile = async (req: AuthRequest<{}, {}, UpdateProfileBody>, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    const err = error as ApiError;
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: err.message 
    });
  }
};

export const changePassword = async (req: AuthRequest<{}, {}, ChangePasswordBody>, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    const err = error as ApiError;
    res.status(500).json({ 
      message: 'Error changing password', 
      error: err.message 
    });
  }
}; 