
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fullname = this.fullname.value;
    const email = this.email.value;
    const password = this.password.value;

    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullname, email, password }),
    })
      .then(response => response.text())
      .then(data => {
        alert(data);
        this.reset();
      })
      .catch(err => console.error("Error:", err));
  });

