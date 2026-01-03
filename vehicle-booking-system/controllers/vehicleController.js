const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');


exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'name');
    res.render('vehicles', {
      vehicles,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


exports.getOwnerVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.render('owner/dashboard', {
      vehicles,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


exports.createVehicle = async (req, res) => {
  try {
    const { vehicleName, source, destination, departureTime } = req.body;
    
    const vehicle = await Vehicle.create({
      owner: req.user._id,
      vehicleName,
      source,
      destination,
      departureTime
    });     
    
    res.redirect('/owner/dashboard');
    
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};


exports.getVehicleDetails = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name');
    
    if (!vehicle) {
      return res.status(404).render('error', {
        message: 'Vehicle not found'
      });
    }
    
    res.render('vehicle-details', {
      vehicle,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Server error. Please try again.'
    });
  }
};
