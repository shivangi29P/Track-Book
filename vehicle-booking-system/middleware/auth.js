
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.redirect('/login');
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
};

exports.isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).render('error', {
      message: 'Access denied. Only vehicle owners can access this page.'
    });
  }
};

exports.isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).render('error', {
      message: 'Access denied. Only customers can access this page.'
    });
  }
};
