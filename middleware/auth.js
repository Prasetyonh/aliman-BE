import jwt from 'jsonwebtoken';
export const checkToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    const authToken = token.split(' ')[1];

    try {
      const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

      req.userId = decodedToken.userId;
      req.userName = decodedToken.userName;
      req.userRole = decodedToken.userRole;

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token tidak valid' });
    }
  } else {
    return res.status(401).json({ error: 'Token dibutuhkan' });
  }
};
