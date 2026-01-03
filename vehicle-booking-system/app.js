require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const connectDB = require('./config/database');
const { attachUser } = require('./middleware/mapAuth');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const customerRoutes = require('./routes/customerRoutes');
const locationRoutes = require('./routes/locationRoutes');
const busAuthRoutes = require('./routes/Busauth');
const busMapRoutes = require('./routes/Busmap');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const bookingRoutes = require("./routes/resetbookings");
const verificationRoutes = require("./routes/verification");



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(attachUser);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', busAuthRoutes);
app.use('/owner', ownerRoutes);
app.use('/customer', customerRoutes);
app.use('/api', locationRoutes);
app.use('/map', busMapRoutes);
app.use("/", verificationRoutes);
app.use("/", bookingRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});


const busLocations = {};
const connectedUsers = {};
const activeOwners = {};
const userSocketMap = {}; 




io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  
  socket.emit('all-buses', busLocations);
  
 
  socket.emit('all-owners', Object.values(activeOwners));
  

  socket.on('register-user', (data) => {
    const { userId, userRole } = data;
    if (userId && userRole) {
      connectedUsers[socket.id] = { userId, userRole };
      userSocketMap[userId] = socket.id;
      console.log(`User registered: ${userId} as ${userRole}`);
      
      if (userRole === 'owner') {
        sendOwnerData(userId, socket.id);
      }
    }
  });
  
  socket.on('send-location', async (data) => {
    const { busId, latitude, longitude, userId } = data;
    
    if (busId) {
      busLocations[busId] = { latitude, longitude, lastUpdate: Date.now() };
      socket.broadcast.emit('receive-location', { id: busId, latitude, longitude });
    }
    
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          location: {
            latitude,
            longitude,
            lastUpdated: new Date()
          }
        });
        
        const user = connectedUsers[socket.id];
        if (user && user.userRole === 'owner') {
          if (activeOwners[userId]) {
            activeOwners[userId].latitude = latitude;
            activeOwners[userId].longitude = longitude;
            activeOwners[userId].lastUpdate = Date.now();
            
            io.emit('receive-location', activeOwners[userId]);
          } else {
            await sendOwnerData(userId, socket.id);
          }
        }
      } catch (error) {
        console.error('Error updating user location:', error);
      }
    }
  });
  
  socket.on('disconnect', (reason) => {
    const user = connectedUsers[socket.id];
    if (user) {
      if (user.userRole === 'owner' && activeOwners[user.userId]) {
        io.emit('user-disconnected', user.userId);
        delete activeOwners[user.userId];
      }
      
      delete userSocketMap[user.userId];
      delete connectedUsers[socket.id];
    }
    console.log('User disconnected:', socket.id, "Reason:", reason);
  });
});

async function sendOwnerData(ownerId, socketId) {
  try {
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'owner') return;
    
    const vehicles = await Vehicle.find({ owner: ownerId });
    if (!vehicles || vehicles.length === 0) return;
    
    const vehicleInfo = {
      vehicleName: vehicles[0].vehicleName,
      vehicleNumber: vehicles[0].vehicleNumber
    };
    
    activeOwners[ownerId] = {
      id: ownerId,
      latitude: owner.location?.latitude,
      longitude: owner.location?.longitude,
      userRole: 'owner',
      vehicleInfo,
      lastUpdate: Date.now()
    };
    
    io.emit('receive-location', activeOwners[ownerId]);
  } catch (error) {
    console.error('Error getting owner data:', error);
  }
}

setInterval(() => {
  const now = Date.now();
  
  for (const busId in busLocations) {
    if (now - busLocations[busId].lastUpdate > 300000) { 
      delete busLocations[busId];
      io.emit('bus-offline', busId);
    }
  }
  
  for (const ownerId in activeOwners) {
    if (now - activeOwners[ownerId].lastUpdate > 300000) { 
      if (!userSocketMap[ownerId]) {
        io.emit('user-disconnected', ownerId);
        delete activeOwners[ownerId];
      }
    }
  }
}, 60000);






const contactRoutes = require('./routes/contactRoutes');
app.use('/', contactRoutes);

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Server error' });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
