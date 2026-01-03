const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const User = require('../models/User');


exports.bookSeat = async (req, res) => {
  try {
    const { vehicleId, seatNumber } = req.body;
    
   
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
   
    const seatIndex = vehicle.seats.findIndex(seat => seat.seatNumber === parseInt(seatNumber));
    
    if (seatIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid seat number' });
    }
    
    if (vehicle.seats[seatIndex].isBooked) {
      return res.status(400).json({ success: false, message: 'Seat already booked' });
    }
    
 
    vehicle.seats[seatIndex].isBooked = true;
    vehicle.seats[seatIndex].bookedBy = req.user._id;
    
    await vehicle.save();
    
   
    const booking = await Booking.create({
      vehicle: vehicleId,
      customer: req.user._id,
      seatNumber: parseInt(seatNumber)
    });
    
  
    res.status(200).json({
      success: true,
      data: {
        bookingId: booking.bookingId,
        seatNumber,
        vehicleId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({
        path: 'vehicle',
        populate: { path: 'owner', select: 'name' }
      });
    
    res.render('customer/bookings', {
      bookings,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'vehicle',
        populate: { path: 'owner', select: 'name email' }
      })
      .populate('customer', 'name email');
    
    if (!booking) {
      return res.status(404).render('error', {
        message: 'Booking not found'
      });
    }
    
    
    const isAuthorized = 
      booking.customer._id.toString() === req.user._id.toString() || 
      booking.vehicle.owner._id.toString() === req.user._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).render('error', {
        message: 'You are not authorized to view this booking'
      });
    }
    
    res.render('booking-details', {
      booking,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


exports.getVehicleBookings = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).render('error', {
        message: 'Vehicle not found or you are not the owner'
      });
    }
    
    const bookings = await Booking.find({ vehicle: req.params.id })
      .populate('customer', 'name email');
    
    res.render('owner/vehicle-bookings', {
      vehicle,
      bookings,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


