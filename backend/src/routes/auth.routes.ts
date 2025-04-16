import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock user for demonstration
const mockUser = {
  id: '1',
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10)
};

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, mockUser.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: mockUser.id, username: mockUser.username },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// Verify token
router.post('/verify', (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router; 