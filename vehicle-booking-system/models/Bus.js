const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true
  },
  busNumber: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserVehicle'
  },
  schedule: {
    departureTime: String,
    arrivalTime: String
  },
  lastLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Bus', busSchema);
