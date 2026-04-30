const express = require('express'); // Expresspaket
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT för tokens
require('dotenv').config(); // För att använda .env-filen
const cors = require('cors'); // För att ansluta till servern från annan domän
const port = process.env.PORT | 3000;

const app = express();
app.use(bodyParser.json());


// Routes
app.get("/", async(req, res) => {
    res.json("Välkommen till webbtjänsten!")
});

// Startar applikationen
app.listen(port, () => {
    console.log("Servern startade på http://localhost:" + port);
});