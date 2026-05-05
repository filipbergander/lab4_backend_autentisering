// Routes för autentisering
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require("dotenv").config();
const authenticateToken = require("../middleware/authToken.js");

// Använder news-model
const News = require("../models/news.js");

// Route för att hämta alla nyhetsinlägg
router.get("/news", async(req, res) => {
    try {
        let result = await News.find().sort({ created: -1 });
        const formattedResult = result.map(row => ({
            id: row._id,
            headline: row.headline,
            content: row.content,
            author: row.author,
            created: {
                raw: row.created,
                formatted: row.created.toLocaleString("sv-SE", {
                    dateStyle: "short",
                    timeStyle: "short"
                }),
                date: row.created.toLocaleDateString("sv-SE", { dateStyle: "short" }),
                time: row.created.toLocaleTimeString("sv-SE", { timeStyle: "short" })
            }
        }));

        if (result.length === 0) {
            return res.status(404).json({ message: "Det finns inga nyhetsinlägg lagrade!" })
        }
        console.log(result);
        return res.json(formattedResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Kunde inte hämta nyhetsinlägg från databasen",
            error
        });
    }
});

// Skyddad route för att lägga till ett nyhetsinlägg, kräver autentisering med JWT genom middleware
router.post("/news", authenticateToken, async(req, res) => {
    try {
        const { headline, content, author } = req.body;

        // Validera input
        if (!headline || !content || !author) {
            return res.status(400).json({ error: "Ett inlägg kräver rubrik, innehåll och författare!" })
        }

        if (content.length < 10) {
            return res.status(400).json({ error: "Ett inlägg kräver över 10 tecken för sitt innehåll!" })
        }

        if (author.length < 3) {
            return res.status(400).json({ error: "Ett inlägg kräver över 3 tecken för författare!" })
        }

        // Om man angivet alla fälten för ett nyhetsinlägg hamnar man här
        const news = new News({ headline, content, author }); // Skapar nytt inlägg enligt schemat
        await news.save();
        res.status(201).json({ message: "Nytt inlägg har publicerats!" });

    } catch (error) {
        // Felmeddelande när man anger ett redan befintligt inlägg med dess innehåll
        if (error.code === 11000) {
            // Om det redan finns ett inlägg med samma innehåll
            if (error.keyPattern.content) {
                return res.status(400).json({ error: "Samma innehålls finns i en annan artikel!" })
            }
        }
        res.status(500).json({ error: "Fel på server när inlägget skulle skapas!" });
    }
});

// Skyddad route för att radera ett nyhetsinlägg
router.delete("/news/:id", authenticateToken, async(req, res) => {
    try {
        let result = await News.findByIdAndDelete(req.params.id);

        // Om det inte finns något ID med det man försöker radera
        if (!result) return res.status(404).json({ message: "Ange ett ID som finns med i databasen för nyhetsinlägg!" });

        // Om man lyckas med raderingen
        return res.json({
            message: "Nyhetsinlägget raderades från databasen",
            deleted: result
        });
    } catch (error) {
        return res.status(400).json({
            error: "Fel format på angivet ID",
            details: error.message
        });
    }
});

module.exports = router;