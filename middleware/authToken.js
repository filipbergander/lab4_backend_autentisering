const jwt = require('jsonwebtoken'); // JWT för tokens

// Validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] // Andra argumentet tar bort bearer och sedan använder enbart token

    if (token == null) return res.status(401).json({ message: "Inte behörighet för denna sida - saknar token!" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, username) => {
        if (error) return res.status(403).json({ message: "Ogiltig token" });

        req.username = username;
        // Next = klar gå vidare till nästa route / funktion / middleware
        next();
    });
}

module.exports = authenticateToken;