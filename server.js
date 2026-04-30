const express = require('express'); // Expresspaket
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT för tokens
require('dotenv').config(); // För att använda .env-filen
const cors = require('cors'); // För att ansluta till servern från annan domän
const port = process.env.PORT || 3000; // Portanslutning, antingen via .env eller port 3000

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
    res.json({ message: "Skyddad route!" });
});

// Validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] // Andra argumentet tar bort bearer och sedan använder enbart token

    if (token == null) res.status(401).json({ message: "Inte behörighet för denna sida - saknar token!" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, username) => {
        if (error) return res.status(403).json({ message: "Ogiltig token" });

        req.username = username;
        // Next = klar gå vidare till nästa route / funktion / middleware
        next();
    });
}

// Startar applikationen
app.listen(port, () => {
    console.log("Servern startade på http://localhost:" + port);
});