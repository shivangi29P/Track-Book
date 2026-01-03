document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('form');
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    try {
      const response = await fetch(registerForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      });
      
      if (response.ok) {
        window.location.href = '/map';
      } else {
        const errorText = await response.text();
        alert(errorText || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});
