import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AttendanceState from '../models/AttendanceState.js';

// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      // Create empty attendance state for new user
      await AttendanceState.create({ user: user._id });

      generateToken(res, user._id);
      res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  const user = { _id: req.user._id, name: req.user.name, email: req.user.email };
  res.status(200).json(user);
};
