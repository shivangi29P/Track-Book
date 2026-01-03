const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.attachUser = async (req, res, next) => {
  try {
   
    const token = req.cookies.jwt;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      req.user = null;
      return next();
    }

   
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in attachUser middleware:', error);
    req.user = null;
    next();
  }
};
