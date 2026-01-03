const socket = io();
const map = L.map("map").setView([20.5937, 78.9629], 5); 
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};
const userId = document.getElementById('userId')?.value;
const userRole = document.getElementById('userRole')?.value;

const vehicleIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});


if (userId && userRole) {
  socket.emit('register-user', { userId, userRole });
  console.log(`Registered as ${userRole} with ID: ${userId}`);
}

function updateMarker(id, latitude, longitude, vehicleInfo) {
 
  if (!vehicleInfo || !latitude || !longitude) return;
  
  console.log(`Updating marker for ${id} at ${latitude},${longitude} with vehicle ${vehicleInfo.vehicleNumber}`);
  
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
    
    markers[id].getPopup().setContent(
      `Vehicle : <span class="vehicle-number">${vehicleInfo.vehicleName}</span>`
    );
  } else {
    markers[id] = L.marker([latitude, longitude], { icon: vehicleIcon }).addTo(map);
    markers[id].bindPopup(
      `Vehicle : <span class="vehicle-number">${vehicleInfo.vehicleName}</span>`
    ).openPopup();
    
    console.log(`Created new marker for owner ${id} with vehicle ${vehicleInfo.vehicleNumber}`);
  }
}

function removeMarker(id) {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    console.log("Removed marker for user:", id);
  }
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      
      if (accuracy > 50) {
        console.warn("Skipping low-accuracy location:", accuracy);
        return;
      }
      
      console.log("Sending my location:", latitude, longitude);
      
    
      socket.emit("send-location", {
        latitude,
        longitude,
        userId: userId || null
      });
      
     
      map.setView([latitude, longitude], 15);
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}


socket.on("receive-location", (data) => {
  const { id, latitude, longitude, userRole, vehicleInfo } = data;
  
  
  if (userRole === 'owner' && vehicleInfo) {
    console.log(`Received location from owner ${id}:`, latitude, longitude, vehicleInfo);
    updateMarker(id, latitude, longitude, vehicleInfo);
  }
});

socket.on("all-owners", (owners) => {
  console.log("Received all active owners:", owners);
  owners.forEach(owner => {
    if (owner.userRole === 'owner' && owner.vehicleInfo) {
      updateMarker(owner.id, owner.latitude, owner.longitude, owner.vehicleInfo);
    }
  });
});


socket.on("user-disconnected", (id) => {
  removeMarker(id);
  console.log("User disconnected, removed marker for:", id);
});


