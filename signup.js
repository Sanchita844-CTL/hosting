document.addEventListener('DOMContentLoaded', function() {
  // Password toggle functionality
  const togglePasswords = document.querySelectorAll('.toggle-password');
  
  togglePasswords.forEach(icon => {
    icon.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      
      // Toggle the eye icon
      this.classList.toggle('fa-eye-slash');
      this.classList.toggle('fa-eye');
    });
  });

  // Signup button functionality
  document.getElementById('signupBtn').addEventListener('click', function() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (fullname && email && password) {
      // In a real app, you would handle registration here
      alert('Account created successfully!');
      window.location.href = 'index.html'; // Redirect to login
    } else {
      alert('Please fill in all fields');
    }
  });
});