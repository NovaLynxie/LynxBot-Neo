const logger = require('../utils/logger')("dashboard");
const { models: { Common } } = require('../utils/storage');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
// initialize strategy and store
const { Strategy: DiscordStrategy, DiscordScope } = require('discord-strategy');
const SQLiteStore = require('connect-sqlite3')(session);
// express application instance
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
// error handler middleware
app.use((err, req, res, next) => {
    logger.error(`${err.name}: ${err.message ?? "An error has occurred! Check the logs for more information."}`);
    logger.error(err.stack);
    res.status(500).send("Something went wrong! Please go back and try again.");
});
// dashboard service functions
function init(config) {
    // initialize helmet middleware
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`, 'https:'],
                fontSrc: [`'self'`, 'https:', 'fonts.googleapis.com', '*.gstatic.com', 'maxcdn.bootstrapcdn.com'],
                imgSrc: [`'self'`, 'https:', 'http:', 'data:', 'w3.org', 'via.placeholder.com', 'cdn.discordapp.com', 'i.giphy.com', 'media.tenor.com'],
                objectSrc: [`'none'`],
                scriptSrc: [`'self'`, 'https:', `'unsafe-inline'`, '*.jquery.com', '*.cloudflare.com', '*.bootstrapcdn.com', '*.datatables.net', '*.jsdelivr.net', '*.googleapis.com', `'nonce-themeLoader'`, `'nonce-memberModals'`],
                scriptSrcElem: [`'self'`, 'https:', `'unsafe-inline'`, `'nonce-themeLoader'`, `'nonce-memberModals'`, '*.jquery.com', '*.cloudflare.com', '*.bootstrapcdn.com', '*.datatables.net', '*.jsdelivr.net'],
                scriptSrcAttr: [`'self'`, 'https:'],
                styleSrcElem: [`'self'`, 'https:', '*.bootstrapcdn.com', '*.googleapis.com'],
                upgradeInsecureRequests: [],
            },
            useDefaults: true,
            reportOnly: config.reportOnly ?? false
        }
    }));
    // initialize passport middleware
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done (null, { id: id }));  
    passport.use(new DiscordStrategy({
        callbackURL: process.env.CALLBACK_URL ?? `${config.dashUrl}/auth/callback`,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scope: [
            DiscordScope.Connections,
            DiscordScope.Identify,
            DiscordScope.Guilds
        ]
    }, async (accessToken, refreshToken, profile, done, consume) => {
        try {
            await Promise.all([consume.connections(), consume.guilds()]);
            profile = await consume.profile();
            done(null, profile);
        } catch (error) {
            done(error?.data ?? error, null);
        };
    }));  
    app.use(passport.initialize()); // initialize passport middleware
    // initialize session middleware
    app.use(session({
        store: new SQLiteStore({ db: 'sessions.db', dir: './data/' }),
        secret: process.env.SESSION_SECRET ?? config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy'
    }));
    // initialize passport session after configuring express-session middleware
    app.use(passport.session());
};
function run(client, { host = "localhost", port = 3000, secure = false } = {}) {
    if (!client) throw Error("Missing or undefined DiscordClient instance!");
    logger.info("Starting dashboard service...");
    const dashUrl = `${secure ? "https" : "http"}://${host}:${port}`; // set dashboard url
    init({ dashUrl, host, port }); // initialize configurable middlewares
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
