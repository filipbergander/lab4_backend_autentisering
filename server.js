const express = require('express'); // Expresspaket
const bodyParser = require('body-parser');
require('dotenv').config(); // För att använda .env-filen
const cors = require('cors'); // För att ansluta till servern från annan domän
const port = process.env.PORT || 3000; // Portanslutning, antingen via .env eller port 3000
const authenticateToken = require("./middleware/authToken.js");

const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes//authRoutes.js');
app.use("/api", authRoutes);

// Välkomstmeddelande
app.get("/", async(req, res) => {
    res.json("Välkommen till webbtjänsten!")
});

// Skyddad route som kräver autentisering med token
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "Skyddad route!",
        user: req.user
    });
});

// Startar applikationen
app.listen(port, () => {
    console.log("Servern startade på http://localhost:" + port);
});