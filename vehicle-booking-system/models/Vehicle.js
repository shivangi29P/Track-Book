const mongoose = require('mongoose');


const VehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleName: {
    type: String,
    required: true
  },
 
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  seats: [{
    seatNumber: Number,
    isBooked: {
      type: Boolean,
      default: false
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


VehicleSchema.pre('save', function(next) {
  if (this.isNew && (!this.seats || this.seats.length === 0)) {
    this.seats = Array.from({ length: 12 }, (_, i) => ({
      seatNumber: i + 1,
      isBooked: false,
      bookedBy: null
    }));
  }
  next();
});

module.exports = mongoose.model('Vehicle', VehicleSchema);

