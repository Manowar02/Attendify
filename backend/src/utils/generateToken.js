import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction ? true : false,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
