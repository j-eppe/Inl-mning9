const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webbserverprogrammering",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  // Läs data från databasen
  connection.query("SELECT * FROM guestbook", (error, results) => {
    if (error) throw error;

    let resultHTML = "<h1>Guestbook</h1>";

    // Loopa igenom resultaten och lägg till varje kommentar till HTML-strängen
    results.forEach((result) => {
      resultHTML += `<p>${result.comment}</p>`;
    });

    // Returnera HTML med resultatet och ett formulär för nya inlägg
    resultHTML += `
      <form action="/submit-data" method="post">
        <input type="text" name="data">
        <button type="submit">Submit</button>
      </form>
    `;

    res.send(resultHTML);
  });
});

app.post("/submit-data", (req, res) => {
  // Spara data till databasen
  const data = req.body.data;
  console.log(data);

  connection.query(
    "INSERT INTO guestbook (comment) VALUES (?)",
    [data],
    (error) => {
      if (error) throw error;

      // Redirect till startsidan för att visa de nya resultaten
      res.redirect("/");
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
