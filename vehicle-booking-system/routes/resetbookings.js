const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle"); // Import Vehicle model

// ✅ Route to reset all bookings for a specific vehicle
router.post("/reset-bookings/:vehicleId", async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;

        // ✅ Reset all seats by setting `isBooked: false`
        await Vehicle.updateOne({ _id: vehicleId }, { 
            $set: { "seats.$[].isBooked": false } 
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Error resetting bookings:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
