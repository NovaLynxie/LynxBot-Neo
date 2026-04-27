const logger = require('../../utils/logger')("dashboard");
const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('index.ejs', { title:  "Login" });
});

module.exports = router;