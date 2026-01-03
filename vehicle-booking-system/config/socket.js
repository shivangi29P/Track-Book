
const socketIO = require('socket.io');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

function setupSocket(server) {
  const io = socketIO(server);
  
  const connectedUsers = new Map(); 
  
  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    
    socket.on('register-user', async (userData) => {
      const { userId, userRole } = userData;
      
      if (userId) {
        
        connectedUsers.set(userId, socket.id);
        
        
        socket.userId = userId;
        socket.userRole = userRole;
        console.log(`User registered: ${socket.userId} as ${socket.userRole}`);
      }
    });
    
    socket.on('seatBooked', (data) => {
      io.emit('seatStatusChanged', data);
    });
    
    socket.on('send-location', async function (data) {
      const { latitude, longitude, userId } = data;
      
      try {
        if (userId) {
       
          const user = await User.findByIdAndUpdate(userId, {
            location: {
              latitude,
              longitude,
              lastUpdated: Date.now()
            }
          }, { new: true });
          
          
          if (user && user.role === 'owner') {
         
            const vehicles = await Vehicle.find({ owner: userId });
            const vehicleInfo = vehicles.length > 0 ? 
              { vehicleName: vehicles[0].vehicleName, vehicleNumber: vehicles[0].vehicleNumber } : 
              { vehicleName: 'Unknown', vehicleNumber: 'Unknown' };
            
      
            io.emit("receive-location", {
              id: userId, 
              userId: userId,
              userRole: user.role,
              latitude,
              longitude,
              vehicleInfo
            });
          }
        }
      } catch (error) {
        console.error('Error updating location in database:', error);
      }
    });
    
    socket.on("disconnect", async function () {
    
      if (socket.userId) {
        console.log('User disconnected:', socket.userId);
        
       
        connectedUsers.delete(socket.userId);
        
       
        io.emit("user-disconnected", socket.userId);
        
        try {
        
          await User.findByIdAndUpdate(socket.userId, {
            'location.lastUpdated': null 
          });
        } catch (error) {
          console.error('Error updating user offline status:', error);
        }
      } else {
        console.log('Client disconnected:', socket.id);
      }
    });
  });

  return io;
}

module.exports = setupSocket;

