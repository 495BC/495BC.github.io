// Google Sheets CSV Links (Replace these with your own links)
const CSV_QB_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQv20vUSyozLzoZmyfQGHiPHx0JNlnZoZlGxa6K9ZjdCPhHdjWXb8ToDvebBaxRz3CJfWPjj0bI18Zy/pub?output=csv";
const CSV_WR_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpAk3lRX606aOmjB9zgpHaQzxlKc-stoJRD-1DW2UjkeDUIpgfvorq1qfedCsOEc9Zg_8Z6RxCJV9x/pub?output=csv";
const CSV_DB_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4EemaFNDP_y7-mnuKQdES6iAoNCAKpeWD0kbDsY_geFPbttzs0umb5Ja-Xg2fu8hpIE3uhP3fXdIO/pub?output=csv";
const CSV_DE_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSODRpqky0PxX7b2epxF2a6GFy7FyEKk7onSn96X9FjHSZXv03nE9zxQC6s35AiM1q8W7d1zrowdurX/pub?output=csv";

// Sections for stats
const sections = ["qb-section", "wr-section", "db-section", "de-section"];

// When the page loads, fetch stats & check login state
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("qb-table")) {
    fetchAndBuildTable(CSV_QB_LINK, "qb-table");
    fetchAndBuildTable(CSV_WR_LINK, "wr-table");
    fetchAndBuildTable(CSV_DB_LINK, "db-table");
    fetchAndBuildTable(CSV_DE_LINK, "de-table");

    showSection("qb-section"); // Show QB section by default
  }

  if (document.getElementById("scores-table")) {
    loadScores();
  }

  checkAdminLogin();
});

// Show selected section and hide others
function showSection(sectionId) {
  sections.forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? "block" : "none";
  });
}

// Fetch CSV, parse it, and build a table
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

      // Clear old content
      thead.innerHTML = "";
      tbody.innerHTML = "";

      // Build table headers
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
      data.forEach((row, index) => {
        const tr = document.createElement("tr");

        // Rank column
        const rankTd = document.createElement("td");
        rankTd.textContent = index + 1;
        tr.appendChild(rankTd);

        // Add data cells
        fields.forEach(fieldName => {
          const td = document.createElement("td");
          const rawValue = row[fieldName] || "";

          // Convert "RATING" number to stars
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

// Admin Login System
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;
      if (user === "495BC" && pass === "Kaufermann#123") {
        localStorage.setItem("admin", "true");
        window.location.href = "scores.html";
      } else {
        alert("Incorrect credentials!");
      }
    });
  }
});

// Check if admin is logged in and show admin buttons
function checkAdminLogin() {
  const isAdmin = localStorage.getItem("admin") === "true";
  const adminButton = document.getElementById("admin-button");
  if (adminButton) {
    adminButton.style.display = isAdmin ? "block" : "none";
  }
}

// Logout Function
function logoutAdmin() {
  localStorage.removeItem("admin");
  alert("You have been logged out.");
  window.location.href = "login.html";
}

// Load Scores Table
function loadScores() {
  const scoresTable = document.getElementById("scores-table").querySelector("tbody");
  const scores = JSON.parse(localStorage.getItem("gameScores")) || [];

  scoresTable.innerHTML = "";

  scores.forEach((game, index) => {
    const tr = document.createElement("tr");

    const weekTd = document.createElement("td");
    weekTd.textContent = `Week ${index + 1}`;
    tr.appendChild(weekTd);

    const matchupTd = document.createElement("td");
    matchupTd.innerHTML = `<strong>${game.homeTeam}</strong> (${game.homeScore}) - (${game.awayScore}) <strong>${game.awayTeam}</strong>`;
    tr.appendChild(matchupTd);

    scoresTable.appendChild(tr);
  });
}

// Handle Score Submission in Admin Panel
document.addEventListener("DOMContentLoaded", function () {
  const scoreForm = document.getElementById("score-form");
  if (scoreForm) {
    scoreForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const homeTeam = document.getElementById("home-team").value;
      const homeScore = document.getElementById("home-score").value;
      const awayTeam = document.getElementById("away-team").value;
      const awayScore = document.getElementById("away-score").value;

      if (!homeTeam || !awayTeam || homeScore === "" || awayScore === "") {
        alert("Please fill in all fields.");
        return;
      }

      const newScore = { homeTeam, homeScore, awayTeam, awayScore };
      let scores = JSON.parse(localStorage.getItem("gameScores")) || [];
      scores.push(newScore);
      localStorage.setItem("gameScores", JSON.stringify(scores));

      alert("Score added successfully!");
      window.location.href = "scores.html";
    });
  }
});
