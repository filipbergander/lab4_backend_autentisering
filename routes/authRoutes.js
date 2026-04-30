// Routes för autentisering
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require("dotenv").config();

// Anslutning mot mongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Ansluten till mongoDB!")
}).catch((error) => {
    console.error("Fel vid anslutning mot databasen...");
});

// Använder user-model
const User = require("../models/User");

// Route för att lägga till en ny användare
router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validera input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Felaktig information angiven. Skicka användarnamn, mejl och lösenord" })
        }

        // Om man angivet både användarnamn och lösenord hamnar man här
        const user = new User({ username, email, password }); // Skapar ny användare
        await user.save();
        res.status(201).json({ message: "Ny användare skapad!" });

    } catch (error) {
        console.log("Kan inte registrera ny användare: ", error)
        res.status(500).json({ error: "Fel på server" });
    }
    console.log("Kallar på registret...")
});

// Logga in en användare
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        error = {};


        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktig information angiven. Skicka användarnamn, mejl och lösenord!" });
        }


        // Finns användaren?
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Inkorrekt användarnamn, mejl eller lösenord!" })
        }


        // Se att lösenordet stämmer överens
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Inkorrekt användarnamn, mejl eller lösenord!" })
        } else {
            // Skapa jsonwebtoken
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const response = {
                message: "Användare inloggad!",
                token: token
            }
            res.status(200).json({ response });
        }

    } catch (error) {
        res.status(500).json({ error: "Fel på server" });
    }
    console.log("Inloggning kallad...");
});
module.exports = router;