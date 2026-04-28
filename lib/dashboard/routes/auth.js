const logger = require('../../utils/logger')("dashboard");
const passport = require('passport');
const { Router } = require('express');
const router = Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { session: false }), (req, res) => {
    res.status()
});

module.exports = router;