const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("VehicleData", vehicleSchema);
