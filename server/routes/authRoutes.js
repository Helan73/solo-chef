const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Register route
router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error registering user');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/'); // Redirect to homepage after registration
        });
    });
});

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // Redirect to homepage after login
    failureRedirect: '/login', // Redirect back to login page if authentication fails
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
