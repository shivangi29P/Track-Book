document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    try {
      const response = await fetch(loginForm.action, {
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
        alert(errorText || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});
