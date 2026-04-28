const logger = require('../../utils/logger')("dashboard");
const passport = require('passport');
const { Router } = require('express');
const router = Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { session: false }), (req, res) => {
    res.status(200).send("Authenticated Successfully!");
});
router.post('/logout', (req, res, next) => {
    req.logout(null, (err) => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        };
    });
});
module.exports = router;