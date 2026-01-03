const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('register', {
        error: 'User already exists',
        name,
        email
      });
    }

    
    const user = await User.create({
      name,
      email,
      password,
      role
    });

   
    const token = generateToken(user._id);


    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    if (user.role === 'owner') {
      res.redirect('/owner/register-vehicle');
    } else {
      res.redirect('/customer/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('register', {
      error: 'Server error. Please try again.',
      name: req.body.name,
      email: req.body.email
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        error: 'Invalid credentials',
        email
      });
    }

   
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid credentials',
        email
      });
    }


    const token = generateToken(user._id);

    
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    if (user.role === 'owner') {
      res.redirect('/owner/dashboard');
    } else {
      res.redirect('/customer/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('login', {
      error: 'Server error. Please try again.',
      email: req.body.email
    });
  }
};


exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.redirect('/login');
};
