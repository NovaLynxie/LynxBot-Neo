const logger = require('../utils/logger')("dashboard");
const {} = require('node:fs');
const path = require('node:path');
const express = require('express');

// TODO: Implement dashboard server?
const app = express();
// config express application
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
// basic express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// router express middleware
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dash', require('./routes/dash'));

function run(client, { protocol = "http", host = "localhost", port = 3000 } = {}) {
    logger.info("Starting dashboard service...");
    if (!client) throw Error("Missing or undefined DiscordClient instance!");
    const dashUrl = `${protocol}://${host}:${port}`;
    app.listen(port, host, (error) => {
        if (error) {
            logger.error(`${error.name}: ${error.message}`);
            logger.error(`Caused by ${error.cause ?? "unknown"}`);
            logger.debug(error.stack ?? "No stacktrace available!");
        } else {
            logger.info(`Dashboard service started! Visit it at ${dashUrl}`);
        };
    });
};

module.exports = { run };