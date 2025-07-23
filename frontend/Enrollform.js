// Enrollform.js
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

 const response = await fetch('http://localhost:3000/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    alert('Enrollment successful!');
    window.location.href = "Home1.html"; // or wherever you redirect
  } else {
    alert('Enrollment failed.');
  }
});

