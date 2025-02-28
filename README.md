<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AFS Stats - GitHub Pages</title>
  <style>
    /* Basic Reset & Body */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333;
      padding: 1rem;
    }
    /* Header / Nav */
    header {
      background-color: #000;
      padding: 1rem;
      margin-bottom: 2rem;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
    }
    nav ul li a {
      color: #fff;
      text-decoration: none;
      font-weight: bold;
    }
    .enroll-button {
      float: right;
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: bold;
    }
    /* Headings */
    h1 {
      margin-bottom: 1rem;
    }
    h2 {
      margin-bottom: 0.5rem;
      margin-top: 1.5rem;
      color: #444;
    }
    /* Section Layout */
    section {
      margin-bottom: 2rem;
      background-color: #fff;
      padding: 1rem;
      border-radius: 4px;
    }
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    table th, table td {
      border: 1px solid #ccc;
      padding: 0.75rem 1rem;
      text-align: left;
    }
    table th {
      background-color: #e6e6e6;
      font-weight: bold;
    }
  </style>

  <!-- Include Papa Parse via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js"></script>
</head>
<body>

  <!-- HEADER / NAV -->
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Scores</a></li>
        <li><a href="#">Stats</a></li>
        <li><a href="#">Rulebook</a></li>
        <li><a href="#">Schoolbooks</a></li>
      </ul>
      <button class="enroll-button">Enroll Now</button>
    </nav>
  </header>

  <h1>AFS Stats</h1>

  <!-- QB SECTION -->
  <section id="qb-section">
    <h2>Quarterback Stats</h2>
    <table id="qb-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </section>

  <!-- WR SECTION -->
  <section id="wr-section">
    <h2>Wide Receiver Stats</h2>
    <table id="wr-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </section>

  <!-- DB SECTION -->
  <section id="db-section">
    <h2>Defensive Back Stats</h2>
    <table id="db-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </section>

  <!-- DE SECTION -->
  <section id="de-section">
    <h2>Defensive End Stats</h2>
    <table id="de-table">
      <thead></thead>
      <tbody></tbody>
    </table>
  </section>

  <script>
    // -- Replace these with your own published CSV links:
    const CSV_QB_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQv20vUSyozLzoZmyfQGHiPHx0JNlnZoZlGxa6K9ZjdCPhHdjWXb8ToDvebBaxRz3CJfWPjj0bI18Zy/pub?output=csv";
    const CSV_WR_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpAk3lRX606aOmjB9zgpHaQzxlKc-stoJRD-1DW2UjkeDUIpgfvorq1qfedCsOEc9Zg_8Z6RxCJV9x/pub?output=csv";
    const CSV_DB_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4EemaFNDP_y7-mnuKQdES6iAoNCAKpeWD0kbDsY_geFPbttzs0umb5Ja-Xg2fu8hpIE3uhP3fXdIO/pub?output=csv";
    const CSV_DE_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuB1-17W9_4DvGrinp3ovMjspVwLlVm6sL44sQM1yZY-EttTSKCVfazjlnmaglwf_bN0Acq0XOmIw8/pub?output=csv";

    // On page load, build all four tables
    window.addEventListener('DOMContentLoaded', () => {
      fetchAndBuildTable(CSV_QB_LINK, "qb-table");
      fetchAndBuildTable(CSV_WR_LINK, "wr-table");
      fetchAndBuildTable(CSV_DB_LINK, "db-table");
      fetchAndBuildTable(CSV_DE_LINK, "de-table");
    });

    /**
     * fetchAndBuildTable - Dynamically builds columns & rows from CSV,
     * adding a "Rank" column and converting "RATING" numbers into stars.
     *
     * @param {string} csvLink - The published CSV link
     * @param {string} tableId - The ID of the <table> element
     */
    function fetchAndBuildTable(csvLink, tableId) {
      fetch(csvLink)
        .then(response => response.text())
        .then(csvText => {
          // Parse CSV with Papa Parse
          const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
          const data = results.data;           // array of row objects
          const fields = results.meta.fields;  // array of column headers

          // Get table references
          const table = document.getElementById(tableId);
          const thead = table.querySelector("thead");
          const tbody = table.querySelector("tbody");

          // Clear any existing content
          thead.innerHTML = "";
          tbody.innerHTML = "";

          // Build the header row (including a "Rank" column)
          const headerRow = document.createElement("tr");
          
          // Rank column
          const rankTh = document.createElement("th");
          rankTh.textContent = "Rank";
          headerRow.appendChild(rankTh);

          // For each field in the CSV, create a <th>
          fields.forEach(fieldName => {
            const th = document.createElement("th");
            th.textContent = fieldName;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);

          // Build table rows
          data.forEach((rowObj, index) => {
            const tr = document.createElement("tr");

            // Rank cell
            const rankTd = document.createElement("td");
            rankTd.textContent = index + 1;
            tr.appendChild(rankTd);

            // For each CSV column, create a cell
            fields.forEach(fieldName => {
              const td = document.createElement("td");
              const rawValue = rowObj[fieldName] || "";

              // Convert RATING number to stars
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
  </script>

</body>
</html>
