
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/auth');


router.post('/update-location', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    
    await User.findByIdAndUpdate(req.user._id, {
      location: {
        latitude,
        longitude,
        lastUpdated: Date.now()
      }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/owner-locations', async (req, res) => {
  try {
   
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const owners = await User.find({ 
      role: 'owner',
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true },
      'location.lastUpdated': { $exists: true, $gt: fiveMinutesAgo }
    });
    
    const ownersWithVehicles = await Promise.all(
      owners.map(async (owner) => {
        const vehicles = await Vehicle.find({ owner: owner._id });
        return {
          id: owner._id,
          name: owner.name,
          location: owner.location,
          vehicles: vehicles.map(v => ({
            id: v._id,
            name: v.vehicleName,
            number: v.vehicleNumber
          }))
        };
      })
    );
    
    res.status(200).json(ownersWithVehicles);
  } catch (error) {
    console.error('Error fetching owner locations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
