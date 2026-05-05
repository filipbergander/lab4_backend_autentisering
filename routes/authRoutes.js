// Routes för autentisering
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require("dotenv").config();

// Använder user-model
const User = require("../models/user.js");

// Route för att lägga till en ny användare
router.post("/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validera input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Felaktig information angiven. Skicka användarnamn, mejl och lösenord" })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Ett lösenord måste vara minst 6 tecken!" })
        }

        // Om man angivet användarnamn, mejl och lösenord hamnar man här
        const user = new User({ username, email, password }); // Skapar ny användare
        await user.save();
        res.status(201).json({ message: "Ny användare skapad!" });

    } catch (error) {
        // Felmeddelande när man anger ett redan befintligt användarnamn/mejl (duplicate-error)
        if (error.code === 11000) {
            // Om det redan finns ett användarnamn med samma namn
            if (error.keyPattern.username) {
                return res.status(400).json({ error: "Användarnamnet finns redan!" })
            }
            // Om det redan finns en mejl med samma namn
            if (error.keyPattern.email) {
                return res.status(400).json({ error: "Emailen finns redan!" })
            }
        }
        res.status(500).json({ error: "Fel på server vid registrering" });
    }
});

// Logga in en användare
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        error = {};

        // Validera input
        if (!email || !password) {
            return res.status(400).json({ error: "Felaktig information angiven. Ange korrekt mejl och lösenord!" });
        }

        // Finns användaren redan?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Inkorrekt mejl eller lösenord!" })
        }

        // Se att lösenordet stämmer överens
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Inkorrekt mejl eller lösenord!" })
        } else {

            // Skapa jsonwebtoken
            const payload = { username: user.username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const responseMsg = JSON.stringify({ username: user.username, email: user.email });
            res.status(200).json({
                response: {
                    message: "Användare inloggad",
                    user: {
                        username: user.username,
                        email: user.email,
                        created: {
                            raw: user.account_created,
                            formatted: user.account_created.toLocaleString("sv-SE", {
                                dateStyle: "long",
                                timeStyle: "short"
                            })
                        }
                    },
                    token
                }
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Fel på server" });
        return;
    }
    console.log("Inloggning kallad...");
});

module.exports = router;