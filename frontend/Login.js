document.querySelector('#loginform').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok && result.message === "Login successful") {
      // Store user data in localStorage if needed
      localStorage.setItem('fullname', result.fullname);
      localStorage.setItem('email', result.email);
      localStorage.setItem('role', result.role);
      localStorage.setItem('enrolled', result.enrolled);

      // Redirect based on role/enrollment status
      if (result.role === 'instructor') {
        window.location.href = '/Home2.html';
      } 
      else if (result.role === 'student') {
        if (result.enrolled) {
          window.location.href = '/Home1.html';
        } else {
          window.location.href = '/Home.html';
        }
      }
    } else {
      alert(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
});
