require("dotenv").config();
const logger = require("./logger")("config");
const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const toml = require("toml");
// load bot configuration file
let config = {}; // config placeholder object
try {
    if (!existsSync("./config.toml")) {
        logger.warn("Configuration file not found! Generating a new one...");
        let configTemplate = readFileSync("./lib/assets/templates/config.toml", "utf-8");
        writeFileSync("./config.toml", configTemplate);
    };
    logger.debug("Loading bot configuration...");
    config = toml.parse(readFileSync("./config.toml", "utf-8"));
} catch (err) {
    logger.error(`${err.code}: ${err.message}`);
    logger.debug(err.stack);
    process.exit(-1);
};
// use process env override parameters here if defined, else fallback to configuration file as default
config.storage["dialect"] = process.env.DB_DIALECT ?? config.storage["dialect"] ?? "sqlite";
config.storage["hostname"] = process.env.DB_HOSTNAME ?? config.storage["hostname"] ?? "localhost";
config.storage["username"] = process.env.DB_USERNAME ?? config.storage["username"] ?? "root";
config.storage["password"] = process.env.DB_PASSWORD ?? config.storage["password"] ?? "";
// verify application configuration values here
if (!config.storage.password || config.storage.password == "") logger.warn("No database password was provided! Data will be unencrypted.");
// verify application environment values before starting
if (!process.env.DISCORD_TOKEN) {
    logger.error("Missing or undefined parameter \"DISCORD_TOKEN\"!");
    logger.warn("Please provide a valid Discord application token.");
    process.exit(-1);
};
// verbose output for debugging purposes. always hidden unless "LOG_LEVEL=verbose" is set in ENV variables
if (config.developer.enableDebug) {
    logger.verbose("Debug mode is enabled! Application may run slower than normal in this mode.");
    logger.verbose(JSON.stringify(config, null, 2));
};
module.exports = config; // export "config" object for application usage