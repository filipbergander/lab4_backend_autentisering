const express = require('express'); // Expresspaket
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT för tokens
require('dotenv').config(); // För att använda .env-filen
const port = process.env.PORT | 3000;

const app = express();
app.use(bodyParser.json());

// Startar applikationen
app.listen(port, () => {
    console.log("Servern startade på http://localhost:" + port);
});