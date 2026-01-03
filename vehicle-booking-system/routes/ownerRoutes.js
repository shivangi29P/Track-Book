const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const { protect, isOwner } = require('../middleware/auth');


router.get('/dashboard', protect, isOwner, vehicleController.getOwnerVehicles);


router.get('/register-vehicle', protect, isOwner, (req, res) => {
  res.render('owner/register-vehicle', { user: req.user });
});


router.get('/add-vehicle', protect, isOwner, (req, res) => {
  res.render('owner/add-vehicle', { user: req.user });
});

router.post('/add-vehicle', protect, isOwner, vehicleController.createVehicle);


router.get('/vehicle/:id/bookings', protect, isOwner, bookingController.getVehicleBookings);

module.exports = router;
