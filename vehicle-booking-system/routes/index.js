
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');


router.get('/', (req, res) => {
  res.render('home_page');
});

router.get('/index', (req, res) => {
  res.render('index');
});
router.get('/about', (req, res) => {
  res.render('about');
});
router.get('/contact', (req, res) => {
  res.render('contact');
});




router.get('/magic', (req, res) => {
 
  const token = req.cookies.jwt;
  if (token && req.user) {
    res.render('magic', { user: req.user });
  } else {
    res.render('magic', { user: null });
  }
});


router.get('/dashboard', protect, (req, res) => {
  if (req.user.role === 'owner') {
    res.redirect('/owner/dashboard');

   
  } else {
    res.redirect('/customer/dashboard');
  }
});

module.exports = router;
