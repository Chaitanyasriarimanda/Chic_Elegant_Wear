document.addEventListener("DOMContentLoaded", () => {
  // Register
  document.getElementById("register-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.email === email);
    if (exists) {
      alert("User already registered.");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered successfully. You can now log in.");
  });

  // Login
  document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert("Invalid credentials.");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Welcome " + user.name + "!");
    window.location.href = "index.html";
  });
});
