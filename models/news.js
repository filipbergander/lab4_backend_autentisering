const mongoose = require('mongoose');

// Schema för ett nyhetsinlägg
const newsSchema = new mongoose.Schema({
    headline: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        minlength: 3
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Lägger till collectionen news -> users inom mongoDB
const News = mongoose.model("News", newsSchema);
// Exporterar schemat för att kunna användas inom resten av filer
module.exports = News;