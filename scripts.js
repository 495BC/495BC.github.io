// Existing DOMContentLoaded for showing/hiding admin/login/logout buttons
document.addEventListener("DOMContentLoaded", function () {
  const adminButton = document.getElementById("admin-button");
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
function logoutAdmin() {
  localStorage.removeItem("admin");
  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  window.location.href = "login.html";
}

  // Check if user is logged in
  if (localStorage.getItem("loggedInUser") === "495BC") {
    if (adminButton) adminButton.style.display = "block"; // Show admin button
    if (loginButton) loginButton.style.display = "none";   // Hide login button
    if (logoutButton) logoutButton.style.display = "block"; // Show logout button
  } else {
    if (adminButton) adminButton.style.display = "none";
    if (loginButton) loginButton.style.display = "block";
    if (logoutButton) logoutButton.style.display = "none";
  }

  // Setup login form event if present
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Replace these credentials with your secure checks
      if (username === "495BC" && password === "Kaufermann#123") {
        localStorage.setItem("loggedInUser", "495BC");
        localStorage.setItem("admin", "true");
        window.location.href = "admin.html";
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    });
  }
});

// Optional: Remove or repurpose this function if you're not using prompt-based login
function login() {
  const username = prompt("Enter Username:");
  const password = prompt("Enter Password:");
  if (username === "495BC" && password === "Kaufermann#123") {
    localStorage.setItem("loggedInUser", "495BC");
    localStorage.setItem("admin", "true");
    alert("Login successful!");
    location.reload(); // Refresh page to update UI
  } else {
    alert("Invalid credentials!");
  }
}
