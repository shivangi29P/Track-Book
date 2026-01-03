const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const { protect, isCustomer } = require('../middleware/auth');


router.get('/dashboard', protect, isCustomer, (req, res) => {
  res.render('customer/dashboard', { user: req.user });
});


router.get('/vehicles', protect, isCustomer, vehicleController.getAllVehicles);


router.get('/vehicle/:id', protect, isCustomer, vehicleController.getVehicleDetails);


router.post('/book-seat', protect, isCustomer, bookingController.bookSeat);


router.get('/bookings', protect, isCustomer, bookingController.getCustomerBookings);


router.get('/booking/:id', protect, bookingController.getBookingDetails);

module.exports = router;
