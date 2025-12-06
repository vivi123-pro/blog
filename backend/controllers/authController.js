const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Create new user (password will be hashed by the User model's pre-save hook)
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        console.log('Login attempt for username:', username);

        const user = await User.findOne({ username });
        console.log('User found:', !!user);

        if (!user) {
            console.log('No user found with username:', username);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch);
        console.log('Entered password length:', password.length);
        console.log('Stored hash length:', user.password.length);

        if (!isMatch) {
            console.log('Password does not match for user:', username);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.userId = user._id;
        console.log('Session set for user ID:', user._id);
        console.log('Session object:', req.session);

        return res.json({ message: "Login Successful" });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: `Server error` });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logout successful' });
    });
};
