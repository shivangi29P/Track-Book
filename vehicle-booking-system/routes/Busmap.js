const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');


const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/Vehiclelogin');
};


router.get('/', isAuthenticated, async (req, res) => {
  try {
    const buses = await Bus.find({}, 'busId busNumber destination');
    
    res.render('Bus_map', {
      user: {
        id: req.session.userId,
        role: req.session.role,
        busId: req.session.busId || null
      },
      buses: buses
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
