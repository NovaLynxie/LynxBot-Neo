require("dotenv").config();
const logger = require("./logger")("config");
const { readFileSync } = require("node:fs");
const toml = require("toml");
// load bot configuration file
let config;
try {
    logger.debug("Loading bot configuration...");
    config = toml.parse(readFileSync("./config.toml", "utf-8"));
} catch (err) {
    logger.error(`${err.code}: ${err.message}`);
    logger.debug(err.stack);
    process.exit(-1);
};
// use process env override parameters here if defined, else fallback to defaults
config.storage["dialect"] = process.env.DB_DIALECT ?? config.storage["dialect"] ?? "sqlite";
config.storage["hostname"] = process.env.DB_HOSTNAME ?? config.storage["hostname"] ?? "localhost";
config.storage["username"] = process.env.DB_USERNAME ?? config.storage["username"] ?? "root";
config.storage["password"] = process.env.DB_PASSWORD ?? config.storage["password"] ?? "";

module.exports = { config };