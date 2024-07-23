const jwt = require('jsonwebtoken');
const secretKey = 'dkjadkiek8DmajPnasmmasjdh'; // Thay đổi secret key mới ở đây

exports.auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log('Authenticated User:', req.user);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

exports.authAdmin = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log('Authenticated Admin:', req.user);

    if (req.user.role === 1) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden - User is not admin' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
