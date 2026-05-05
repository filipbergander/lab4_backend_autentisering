const express = require('express'); // Expresspaket
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config(); // För att använda .env-filen
const cors = require('cors'); // För att ansluta till servern från annan domän
const port = process.env.PORT || 3000; // Portanslutning, antingen via .env eller port 3000
//const authenticateToken = require("./middleware/authToken.js");

const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Anslutning mot mongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Ansluten till mongoDB!")
}).catch((error) => {
    console.error("Fel vid anslutning mot databasen...");
});

// Routes
const authRoutes = require('./routes/authRoutes.js');
const newsRoutes = require('./routes/newsRoutes.js');
app.use("/api", authRoutes);
app.use("/api", newsRoutes);

// Välkomstmeddelande
app.get("/", async(req, res) => {
    res.json("Välkommen till webbtjänsten!")
});

// Startar applikationen
app.listen(port, () => {
    console.log("Servern startade på http://localhost:" + port);
});