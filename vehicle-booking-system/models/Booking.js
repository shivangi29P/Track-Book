const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: Number,
  isBooked: { type: Boolean, default: false }
});


const BookingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  bookingId: {
    type: String,
    unique: true
  },

  seats:[seatSchema] // Array of seats

});


BookingSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    this.bookingId = `BK-${timestamp}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
