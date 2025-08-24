document.addEventListener('DOMContentLoaded', function() {
  // Password toggle functionality
  const togglePassword = document.querySelector('.toggle-password');
  const password = document.getElementById('password');
  
  togglePassword.addEventListener('click', function() {
    // Toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    // Toggle the eye icon
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
  });

  // Existing login button functionality
  document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
      window.location.href = 'dashboard.html';
    } else {
      alert('Please enter both email and password');
    }
  });
});