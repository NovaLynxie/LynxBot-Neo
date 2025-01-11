const { Sequelize, DataTypes } = require("sequelize");
const { readdirSync } = require("node:fs");
const { copyFile } = require("node:fs/promises");
const { config } = require("../utils/config");
const path = require("node:path");
const logger = require("../utils/logger")("storage");

const sequelize = new Sequelize("lynxbot_neo", config.storage.username, config.storage.password, {
    dialect: config.storage.dialect ?? "sqlite",
    host: config.storage.hostname ?? "localhost",
    logging: false,
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0,
    },
    storage: "data/storage.db" // applies to "sqlite" storage only!
});
const dbModelsDir = path.resolve(__dirname, "./models");
const models = {};

logger.info("Initializing database manager...");
for (let module of readdirSync(dbModelsDir).filter((file) => file.endsWith(".model.js"))) {
    try {
        const model = require(`${dbModelsDir}/${module}`);
        if ("name" in model && "category" in model && "define" in model) {
            const { name, category, define } = model;
            if (!models[category]) models[category] = {};
            if (!model.enabled) continue; // skip disabled models
            models[category][name] = define(sequelize, DataTypes, name);
            logger.debug(`Loaded sequelize model "${model.name}" from "${dbModelsDir}/${module}"`);
        } else {
            logger.warn(`Failed to load "${dbModelsDir}/${module}" due to missing required properties!`);
            logger.warn(`Skipped to protect database integrity, some functionality may not work correctly!`);
        };
    } catch(err) {
        logger.error(`${err.name}: ${err.message}`);
        logger.debug(err.stack);
    };
};
async function init(action = "", data = { guild: null, user: null }) {
    const { Common } = models;
    switch (action) {
        case "guild":
            const { guild } = data;
            try {
                const res = await sequelize.transaction(async (trx) => {
                    logger.debug(`Verifying "Settings" table for "${guild.name}" (ID:${guild.id})`);
                    await Common.Settings.findOrCreate({
                        defaults: {
                            guildId: guild.id,
                            staffChannel: null,
                            reportsChannel: null,
                            ticketsChannel: null
                        },
                        where: { guildId: guild.id },
                        transaction: trx
                    });
                });
            } catch (err) {
                logger.error(`Failed to initialize "Common" database tables for "${guild.name}" (${guild.id})!`);
                logger.error(`${err.name}: ${err.message}`); logger.debug(err.stack);
            };
        case "user":
            // TODO - Implement user initialization function callback (WIP)
            const { user } = data;
            try {
                if (!user) return;
            } catch (err) {};
            break;
        default:
            logger.warn(`Unknown action "${action}" name called`);
            break;
    };
};
async function sync(alter =  false, force = false) {
    const getFormattedDate = () => {
        let date = new Date();
		return date.toISOString().replace(/:/g, "-");
    };
    logger.warn("Synchronising database models...");
    if (alter === true || force === true) {
        if (alter) logger.warn(`DB_ALTER was set to TRUE!`);
        if (force) logger.warn(`DB_FORCE was set to TRUE!`);
        try {
            logger.debug("Creating backup of database file...");
            await copyFile("./data/storage.db", `./data/storage-${getFormattedDate()}.db`);
            logger.info(`Database backup created! Saved to "./data/backups/app-storage-${getFormattedDate()}.db"`);
        } catch (err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
            logger.warn("Aborted database backup action to prevent data loss!");
            return; // abort database sync operation to prevent damage to db integrity
        };
    };
    try {
        await sequelize.sync({ alter: alter ?? false, force: force ?? false });
        logger.info("Synchronized database models successfully!");
    } catch (err) {
        logger.error(`${err.name}: ${err.message}`);
        logger.debug(err.stack);
    };
};

module.exports = { models, init, sync };