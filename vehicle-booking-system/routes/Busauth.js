const express = require('express');
const router = express.Router();
const UserVehicle = require('../models/UserVehicle');
const Bus = require('../models/Bus');


const BUS_DRIVER_SECRET_KEY = 'bus-driver-secret-123';


const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/Vehiclelogin');
};


router.get('/', (req, res) => {
  res.redirect('/Vehiclelogin');
});


router.get('/Vehiclelogin', (req, res) => {
  res.render('Vehiclelogin');
});

router.post('/Vehiclelogin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserVehicle.findOne({ username, role: 'public' });
    
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }
    
    req.session.userId = user._id;
    req.session.role = 'public';
    res.redirect('/map');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/Vehicleregister', (req, res) => {
  res.render('Vehicleregister');
});

router.post('/Vehicleregister', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
   
    const existingUser = await UserVehicle.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }
    
   
    const user = new UserVehicle({
      username,
      email,
      password,
      role: 'public'
    });
    
    await user.save();
    
    req.session.userId = user._id;
    req.session.role = 'public';
    res.redirect('/map');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/driver/login', (req, res) => {
  res.render('driver-login');
});

router.post('/driver/login', async (req, res) => {
  try {
    const { username, password, secretKey } = req.body;
    
   
    if (secretKey !== BUS_DRIVER_SECRET_KEY) {
      return res.status(400).send('Invalid secret key');
    }
    
    const user = await UserVehicle.findOne({ username, role: 'driver' });
    
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }
    
   
    const bus = await Bus.findOne({ driver: user._id });
    if (!bus) {
      return res.status(400).send('No bus assigned to this driver');
    }
    
    req.session.userId = user._id;
    req.session.role = 'driver';
    req.session.busId = bus.busId;
    res.redirect('/map');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/driver/register', (req, res) => {
  res.render('driver-register');
});

router.post('/driver/register', async (req, res) => {
  try {
    const { username, email, password, busId, busNumber, destination, departureTime, arrivalTime, secretKey } = req.body;
    
  
    if (secretKey !== BUS_DRIVER_SECRET_KEY) {
      return res.status(400).send('Invalid secret key');
    }
    
   
    const existingUser = await UserVehicle.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }
    
   
    const existingBus = await Bus.findOne({ busId });
    if (existingBus) {
      return res.status(400).send('Bus ID already exists');
    }
    
 
    const user = new UserVehicle({
      username,
      email,
      password,
      role: 'driver'
    });
    
    await user.save();
    
    
    const bus = new Bus({
      busId,
      busNumber,
      destination,
      driver: user._id,
      schedule: {
        departureTime,
        arrivalTime
      }
    });
    
    await bus.save();
    
    req.session.userId = user._id;
    req.session.role = 'driver';
    req.session.busId = busId;
    res.redirect('/map');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/Vehiclelogin');
});

module.exports = router;
