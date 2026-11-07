const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve current user details from database
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.user = user;

    next();

  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

module.exports = { protect };