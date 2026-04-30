const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema för en användare
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    account_created: {
        type: Date,
        default: Date.now
    }
});

// Hashar lösenordet innan save genom pre, 10 salter för det hashade lösenordet
userSchema.pre("save", async function() {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
    } catch (error) {
        throw Error;
    }
});

// Registrera ny användare
userSchema.statics.register = async function(username, email, password) {
    try {
        const user = new this({ username, email, password });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// Jämför lösenorden
userSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
}

// logga in användare
userSchema.statics.login = async function(username, email, password) {
    try {
        const user = await this.findOne({ username });

        // Om den inte hittar en användare
        if (!user) {
            throw new Error("Felaktigt användarnamn, mejl eller lösenord!");
        }

        const isPasswordMatch = await user.comparePassword(password);

        // Vid inkorrekt angivet lösenord
        if (!isPasswordMatch) {
            throw new Error("Felaktigt användarnamn, mejl eller lösenord!")
        }

        return user;
    } catch (error) {
        throw error;
    }
}

// Lägger till collectionen user -> users inom mongoDB
const User = mongoose.model("user", userSchema);
// Exporterar schemat för att kunna användas inom resten av filer
module.exports = User;