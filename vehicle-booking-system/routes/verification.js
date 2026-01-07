const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const VehicleData = require("../models/Vehicle-data");



const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/register-vehicle", (req, res) => res.render("owner/register-vehicle"));

router.post("/register-vehicle", async (req, res) => {
    const { vehicleNumber } = req.body;

    if (!vehicleNumber) {
        return res.status(400).json({ error: "Vehicle number is required!" });
    }

    try {
        await VehicleData.create({ vehicleNumber });
        res.render("owner/success", { vehicleNumber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.get("/verify", (req, res) => res.render("owner/verify"));
router.get("/verify", (req, res) => res.render("owner/dashboard"));


// router.post("/verify", upload.single("image"), async (req, res) => {
//     const { vehicleNumber } = req.body;
//     const imagePath = req.file.path;

//     const python = spawn("python", ["./python-scripts/ocr.py", imagePath]);

//     python.stdout.on("data", async (data) => {
//         const extractedText = data.toString().trim();
//         console.log("Extracted Text:", extractedText);

//         const vehicle = await VehicleData.findOne({ vehicleNumber });
//         if (vehicle && extractedText.includes(vehicleNumber)) {
//             res.redirect("/owner/dashboard?message=✅ Verification Successful!");

//         } else {
//             res.render("owner/result", { message: "❌ Verification Failed!" });
//         }
//     });

//     python.stderr.on("data", (data) => console.error("Python Error:", data.toString()));
// });

module.exports = router;
