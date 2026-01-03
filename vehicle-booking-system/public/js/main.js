document.addEventListener('DOMContentLoaded', function() {
 
  const mainContent = document.querySelector('.container');
  if (mainContent) {
    mainContent.classList.add('fade-in');
  }
  
  
  const socket = io();
 
  const seatLayout = document.getElementById('seatLayout');
  if (seatLayout) {
    const vehicleId = seatLayout.getAttribute('data-vehicle-id');
    let selectedSeat = null;
    
   
    const availableSeats = document.querySelectorAll('.seat.available');
    availableSeats.forEach(seat => {
     
      seat.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
          this.style.transform = 'translateZ(15px) scale(1.05)';
        }
      });
      
      seat.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
          this.style.transform = '';
        }
      });
      
     
      seat.addEventListener('click', function() {
     
        if (selectedSeat) {
          selectedSeat.classList.remove('selected');
          selectedSeat.classList.add('available');
          selectedSeat.style.transform = '';
        }
     
        this.classList.remove('available');
        this.classList.add('selected');
        this.style.transform = 'translateZ(20px) scale(1.1)';
        selectedSeat = this;
        
        
        const seatNumber = this.getAttribute('data-seat');
        document.getElementById('selectedSeatNumber').textContent = seatNumber;
        
        const bookingForm = document.getElementById('bookingForm');
        bookingForm.style.display = 'block';
        bookingForm.classList.add('fade-in');
    
        bookingForm.scrollIntoView({ behavior: 'smooth' });
      });
    });
    

    const cancelButton = document.getElementById('cancelBooking');
    if (cancelButton) {
      cancelButton.addEventListener('click', function() {
        const bookingForm = document.getElementById('bookingForm');
        
       
        bookingForm.style.opacity = '0';
        bookingForm.style.transform = 'translateY(20px)';
        bookingForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          bookingForm.style.display = 'none';
          bookingForm.style.opacity = '1';
          bookingForm.style.transform = '';
          
          if (selectedSeat) {
            selectedSeat.classList.remove('selected');
            selectedSeat.classList.add('available');
            selectedSeat.style.transform = '';
            selectedSeat = null;
          }
        }, 300);
      });
    }
    
   
    const confirmButton = document.getElementById('confirmBooking');
    if (confirmButton) {
      confirmButton.addEventListener('click', function() {
        if (selectedSeat) {
         
           const loadingEl = document.createElement('div');
           loadingEl.className = 'loading';
           loadingEl.innerHTML = '<div></div><div></div><div></div><div></div>';
           
           confirmButton.disabled = true;
           confirmButton.innerHTML = '';
           confirmButton.appendChild(loadingEl);
           
           const seatNumber = selectedSeat.getAttribute('data-seat');
         
           fetch('/customer/book-seat', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               vehicleId: vehicleId,
               seatNumber: seatNumber
             }),
           })
           .then(response => response.json())
           .then(data => {
             if (data.success) {
               
               selectedSeat.classList.remove('selected');
               selectedSeat.classList.add('booked');
               selectedSeat.setAttribute('disabled', 'true');
               
               const checkmark = document.createElement('div');
               checkmark.innerHTML = '✓';
               checkmark.className = 'checkmark';
               checkmark.style.position = 'absolute';
               checkmark.style.fontSize = '2rem';
               checkmark.style.color = 'white';
               checkmark.style.opacity = '0';
               checkmark.style.transform = 'scale(0)';
               checkmark.style.transition = 'all 0.5s ease';
               
               selectedSeat.style.position = 'relative';
               selectedSeat.appendChild(checkmark);
               
               setTimeout(() => {
                 checkmark.style.opacity = '1';
                 checkmark.style.transform = 'scale(1)';
               }, 100);
               
               setTimeout(() => {
                 checkmark.style.opacity = '0';
                 checkmark.style.transform = 'scale(0)';
                 
                 setTimeout(() => {
                   checkmark.remove();
                 }, 500);
               }, 2000);
               
               selectedSeat = null;
               
          
               const bookingForm = document.getElementById('bookingForm');
               bookingForm.style.opacity = '0';
               bookingForm.style.transform = 'translateY(20px)';
               bookingForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
               
               setTimeout(() => {
                 bookingForm.style.display = 'none';
                 bookingForm.style.opacity = '1';
                 bookingForm.style.transform = '';
                 
                
                 const successMessage = document.getElementById('bookingSuccess');
                 successMessage.style.display = 'block';
                 successMessage.classList.add('fade-in');
                 
                
                 successMessage.scrollIntoView({ behavior: 'smooth' });
               }, 300);
               
             
               socket.emit('seatBooked', {
                 vehicleId: vehicleId,
                 seatNumber: seatNumber
               });
             } else {
             
               confirmButton.disabled = false;
               confirmButton.innerHTML = 'Confirm Booking';
               
               const errorMessage = document.createElement('div');
               errorMessage.className = 'alert alert-danger fade-in';
               errorMessage.textContent = 'Booking failed: ' + data.message;
               
               const bookingForm = document.getElementById('bookingForm');
               bookingForm.insertBefore(errorMessage, bookingForm.firstChild);
               
               setTimeout(() => {
                 errorMessage.style.opacity = '0';
                 errorMessage.style.transition = 'opacity 0.5s ease';
                 
                 setTimeout(() => {
                   errorMessage.remove();
                 }, 500);
               }, 3000);
             }
           })
           .catch(error => {
             console.error('Error:', error);
             
         
             confirmButton.disabled = false;
             confirmButton.innerHTML = 'Confirm Booking';
             
             const errorMessage = document.createElement('div');
             errorMessage.className = 'alert alert-danger fade-in';
             errorMessage.textContent = 'An error occurred while booking the seat.';
             
             const bookingForm = document.getElementById('bookingForm');
             bookingForm.insertBefore(errorMessage, bookingForm.firstChild);
             
             setTimeout(() => {
               errorMessage.style.opacity = '0';
               errorMessage.style.transition = 'opacity 0.5s ease';
               
               setTimeout(() => {
                 errorMessage.remove();
               }, 500);
             }, 3000);
           });
         }
       });
     }
   }
   
  
   socket.on('seatStatusChanged', function(data) {
     const seatLayout = document.getElementById('seatLayout');
     if (seatLayout && seatLayout.getAttribute('data-vehicle-id') === data.vehicleId) {
       const seat = document.querySelector(`.seat[data-seat="${data.seatNumber}"]`);
       if (seat) {
   
         seat.style.transform = 'scale(1.2)';
         seat.style.boxShadow = '0 0 15px rgba(231, 74, 59, 0.7)';
         seat.style.transition = 'all 0.5s ease';
         
         setTimeout(() => {
           seat.classList.remove('available', 'selected');
           seat.classList.add('booked');
           seat.setAttribute('disabled', 'true');
           
           setTimeout(() => {
             seat.style.transform = '';
             seat.style.boxShadow = '';
           }, 300);
         }, 500);
       }
     }
   });
   

   const vehicleCards = document.querySelectorAll('.card');
   if (vehicleCards.length > 0) {
     vehicleCards.forEach(card => {
       card.classList.add('vehicle-card');
     });
   }
   
   
   const navLinks = document.querySelectorAll('.nav-link');
   navLinks.forEach(link => {
     link.addEventListener('mouseenter', function() {
       this.style.transform = 'translateY(-3px)';
       this.style.transition = 'transform 0.3s ease';
     });
     
     link.addEventListener('mouseleave', function() {
       this.style.transform = '';
     });
   });
   
  
   const printButton = document.querySelector('.btn-print-receipt');
   if (printButton) {
     printButton.addEventListener('click', function(e) {
       e.preventDefault();
       window.print();
     });
   }
   
  
   const forms = document.querySelectorAll('form');
   forms.forEach(form => {
     form.addEventListener('submit', function(e) {
       const requiredFields = form.querySelectorAll('[required]');
       let isValid = true;
       
       requiredFields.forEach(field => {
         if (!field.value.trim()) {
           isValid = false;
           
           field.classList.add('is-invalid');
           field.style.animation = 'shake 0.5s';
           
           setTimeout(() => {
             field.style.animation = '';
           }, 500);
         } else {
           field.classList.remove('is-invalid');
         }
       });
       
       if (!isValid) {
         e.preventDefault();
       }
     });
     
     const inputs = form.querySelectorAll('input, select, textarea');
     inputs.forEach(input => {
       input.addEventListener('input', function() {
         if (this.hasAttribute('required') && !this.value.trim()) {
           this.classList.add('is-invalid');
         } else {
           this.classList.remove('is-invalid');
         }
       });
     });
   });
   
   const style = document.createElement('style');
   style.innerHTML = `
     @keyframes shake {
       0%, 100% { transform: translateX(0); }
       10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
       20%, 40%, 60%, 80% { transform: translateX(5px); }
     }
   `;
   document.head.appendChild(style);
 });
 

 document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("resetBooking");

  if (resetButton) {  // ✅ Ensure the button exists before adding event listener
      resetButton.addEventListener("click", function () {
          const vehicleId = resetButton.getAttribute("data-vehicle-id"); // Get vehicle ID dynamically

          fetch(`/reset-bookings/${vehicleId}`, { method: "POST" })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      // ✅ Update UI: Change all booked seats (red) to available (green)
                      document.querySelectorAll(".seat.booked").forEach(seat => {
                          seat.classList.remove("booked");
                          seat.classList.add("available");
                      });
                  }
              })
              .catch(error => console.error("Error resetting bookings:", error));
      });
  }
});
