
const socket = io();

const map = L.map("map").setView([20.5937, 78.9629], 5); 
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


const markers = {};
let isTracking = false;
let trackingInterval;

function updateMarker(id, latitude, longitude) {
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); 
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`Bus ID: ${id}`); 
  }
}

document.addEventListener('DOMContentLoaded', () => {
 
  const busSelect = document.getElementById('busSelect');
  if (busSelect) {
    busSelect.addEventListener('change', function() {
      const selectedBusId = this.value;
      
    
      if (!selectedBusId) {
        for (const id in markers) {
          map.removeLayer(markers[id]);
        }
        Object.keys(markers).forEach(id => delete markers[id]);
        return;
      }
      
    
      for (const id in markers) {
        if (id !== selectedBusId) {
          map.removeLayer(markers[id]);
          delete markers[id];
        }
      }
     
      socket.emit('request-bus-location', selectedBusId);
    });
  }
  

  const toggleTrackingBtn = document.getElementById('toggleTracking');
  if (toggleTrackingBtn && userData.role === 'driver') {
    toggleTrackingBtn.addEventListener('click', function() {
      if (isTracking) {
        stopTracking();
        this.textContent = 'Start Tracking';
        this.classList.remove('active');
      } else {
        startTracking();
        this.textContent = 'Stop Tracking';
        this.classList.add('active');
      }
    });
  }
});


function startTracking() {
  if (!userData.busId || userData.role !== 'driver') return;
  
  isTracking = true;
  

  getAndSendLocation();
  
  
  trackingInterval = setInterval(getAndSendLocation, 5000); 
}


function stopTracking() {
  isTracking = false;
  clearInterval(trackingInterval);
  
 
  if (markers['self']) {
    map.removeLayer(markers['self']);
    delete markers['self'];
  }
}


function getAndSendLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        if (accuracy > 50) {
          console.warn("Skipping low-accuracy location:", accuracy);
          return; 
        }
        
        console.log("Sending bus location:", latitude, longitude);
        
       
        socket.emit("send-location", { 
          busId: userData.busId,
          latitude, 
          longitude 
        });
        
      
        updateMarker('self', latitude, longitude);
        
      
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
      }
      
      
      socket.on('all-buses', (busLocations) => {
       
        if (userData.role === 'public' && (!document.getElementById('busSelect') || !document.getElementById('busSelect').value)) {
          return;
        }
        
      
        if (userData.role === 'driver') {
          if (busLocations[userData.busId]) {
            const { latitude, longitude } = busLocations[userData.busId];
            updateMarker('self', latitude, longitude);
            map.setView([latitude, longitude], 15);
          }
          return;
        }
        

        const selectedBusId = document.getElementById('busSelect')?.value;
        if (selectedBusId && busLocations[selectedBusId]) {
          const { latitude, longitude } = busLocations[selectedBusId];
          updateMarker(selectedBusId, latitude, longitude);
          map.setView([latitude, longitude], 15);
        }
      });
      
      
      socket.on('receive-location', (data) => {
        const { id, latitude, longitude } = data;
        
       
        if (userData.role === 'public') {
          const selectedBusId = document.getElementById('busSelect')?.value;
          if (selectedBusId === id) {
            updateMarker(id, latitude, longitude);
            map.setView([latitude, longitude], 15);
          }
        }
        
        
        if (userData.role === 'driver' && id === userData.busId) {
          updateMarker('self', latitude, longitude);
        }
      });
      

      socket.on('bus-offline', (busId) => {
        if (markers[busId]) {
          map.removeLayer(markers[busId]);
          delete markers[busId];
        
          if (userData.role === 'public') {
            const selectedBusId = document.getElementById('busSelect')?.value;
            if (selectedBusId === busId) {
              alert('The selected bus is no longer transmitting its location.');
            }
          }
        }
      });
      