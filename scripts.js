document.addEventListener("DOMContentLoaded", function () {
  const adminButton = document.getElementById("admin-button");
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");

  // Check if user is logged in
  if (localStorage.getItem("loggedInUser") === "495BC") {
    adminButton.style.display = "block"; // Show admin button
    loginButton.style.display = "none";  // Hide login button
    logoutButton.style.display = "block"; // Show logout button
  } else {
    adminButton.style.display = "none";
    loginButton.style.display = "block";
    logoutButton.style.display = "none";
  }
});

// LOGIN FUNCTION
function login() {
  const username = prompt("Enter Username:");
  const password = prompt("Enter Password:");

  if (username === "495BC" && password === "Kaufermann#123") {
    localStorage.setItem("loggedInUser", "495BC");
    alert("Login successful!");
    location.reload(); // Refresh page to update UI
  } else {
    alert("Invalid credentials!");
  }
}

// LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out!");
  location.reload();
}

// Function to navigate between sections
function showSection(sectionId) {
  const sections = ["qb-section", "wr-section", "db-section", "de-section"];
  sections.forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? "block" : "none";
  });
}

// Function to fetch and build tables
function fetchAndBuildTable(csvLink, tableId) {
  fetch(csvLink)
    .then(response => response.text())
    .then(csvText => {
      const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const data = results.data;
      const fields = results.meta.fields;

      const table = document.getElementById(tableId);
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");

      thead.innerHTML = "";
      tbody.innerHTML = "";

      // Build header row
      const headerRow = document.createElement("tr");
      const rankTh = document.createElement("th");
      rankTh.textContent = "Rank";
      headerRow.appendChild(rankTh);

      fields.forEach(fieldName => {
        const th = document.createElement("th");
        th.textContent = fieldName;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Build table rows
      data.forEach((rowObj, index) => {
        const tr = document.createElement("tr");
        const rankTd = document.createElement("td");
        rankTd.textContent = index + 1;
        tr.appendChild(rankTd);

        fields.forEach(fieldName => {
          const td = document.createElement("td");
          const rawValue = rowObj[fieldName] || "";

          if (fieldName.toUpperCase() === "RATING") {
            const ratingValue = parseInt(rawValue, 10) || 0;
            td.textContent = "⭐".repeat(ratingValue);
          } else {
            td.textContent = rawValue;
          }

          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error("Error fetching CSV:", err));
}
