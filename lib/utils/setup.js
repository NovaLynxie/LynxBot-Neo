require("dotenv").config();
const logger = require("./logger")("setup");
const { REST, Routes } = require("discord.js");
const { models, sync } = require("./storage");
const path = require("node:path");
const { readdirSync } = require("node:fs");
const readline = require("node:readline/promises");
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const rlterm = readline.createInterface({ input: process.stdin, output: process.stdout });
// setup commands deploy functions
function fetchCommands() {
    const commands = []; // generate new array
    const cmdsRootPath = path.resolve("./lib/commands");
    const cmdFolders = readdirSync(cmdsRootPath);
    logger.info(`Found ${cmdFolders.length} directories!`);
    for (const folder of cmdFolders) {
        logger.info(`Searching in ${folder}`);
        const commandsPath = path.join(cmdsRootPath, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));
        logger.info(`Found ${commandFiles.length} in ${folder}!`);
        for (const file of commandFiles) {
            const cmdPath = path.join(commandsPath, file);
            const command = require(cmdPath);
            if ("data" in command && "execute" in command) {
                commands.push(command.data.toJSON());
                logger.debug(`Added ${command.data.name} to commands array!`);
            } else {
                logger.error(`Aborted loading command from file "${cmdPath}" due to errors!`);
                logger.warn(`Malformed command file structure! Missing "data" or "execute" properties!`);
            };
        };
    };
    logger.info(`Prepared ${commands.length} commands for syncing!`);
    return commands; // return array of commands
};
async function deployCommands() {
    try {
        logger.warn("Deploying commands to application. This will take a moment.");
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: fetchCommands() }
        );
        logger.debug(`Synced ${data.length} commands to application:${process.env.CLIENT_ID}`);
        logger.info("Successfully deployed or updated application commands! Please check your application to confirm.");
        logger.warn("It may take up to an hour for global commands to propagate to all guilds.");
    } catch (err) {
        logger.error(`${err.name}: ${err.message}`);
        logger.debug(`Response: "${err.code ? err.code : "N/A"}"`);
        logger.debug(err.stack);
        logger.error("Failed to deploy or update application commands!");
        process.exit(-1);
    };
};
async function removeCommands() {
    try {
        const cmds = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );
        logger.info(`Found ${cmds.length} commands to remove.`);
        logger.warn("Removing all commands. This may take a couple minutes.");
        for (const command of cmds) {
            logger.debug(`Removing command "${command.name}" from application:${process.env.CLIENT_ID}`);
            try {
                await rest.delete(
                    Routes.applicationCommand(process.env.CLIENT_ID, command.id)
                );
                logger.debug(`Successfully removed command "${command.name}"!`);
            } catch(err) {
                logger.error(`Failed to delete command "${command.name}"!`);
                logger.error(`${err.code}: ${err.message}`);
                logger.debug(err.stack);
            };
        };
        logger.info("Finished removing application commands! Please check your application to confirm deletion.");
    } catch (err) {
        logger.error(`${err.code}: ${err.message}`);
        logger.debug(err.stack);
        logger.error(`Failed to delete application commands "${command.name}"!`);
        process.exit(-1);
    };
};
process.on("uncaughtException", (err, origin) => {
    logger.error(`${err.name}: ${err.message}`);
    logger.debug(err.stack);
});
process.on("unhandledRejection", (reason, promise) => {
    logger.error(`${reason.name}: ${reason.message}`);
    promise.catch((err) => {
        logger.error(`Caused by ${err.name} with reason ${err.message}`);
        logger.debug(err.stack);
    });
});
async function runSetup() {
    logger.debug(`ClientID=${process.env.CLIENT_ID ? process.env.CLIENT_ID : "N/A"}`);
    logger.debug(`GuildID=${process.env.GUILD_ID ? process.env.GUILD_ID : "N/A"}`);
    // 🚧 setup script menu messages to appear in console 🚧
    const menuText = `
        ⚙️ LynxBot Setup Utility v1.1 ⚙️
    Please select an action to perform:
        [D] - Deploy or update application commands
        [R] - Remove all existing application commands
        [S] - Synchronise database models with database
        [X] - Cancel setup and exit utility
    Enter option: `;
    const dbSyncQueryText = `
        Please choose the sync option for updating your database.
        [U] - Update the database while keeping existing data.   
        [R] - Reset all database tables and rebuild data tables. ⚠️ WARNING! This will result in DATA LOSS! ⚠️
    Enter option: `;
    const confirmSyncText = `
        ⚠️ Warning! ⚠️
        This will synchronise all database models with your application's database, potentially altering or resetting any existing data tables.
        Are you sure you wish to continue? Please type "CONFIRM" to proceed.
    `;
    // 🚧 setup script menu messages to appear in console 🚧
    const menuAction = await rlterm.question(menuText); // get user response to menu displayed
    let confirmAction; // used for confirming user action before proceeding.
    switch (menuAction.substring(0, 1).toUpperCase()) {
        case "D":
            await deployCommands();
            process.exit(0);
        case "R":
            await removeCommands();
            process.exit(0);
        case "S":
            const dbSyncAction = await rlterm.question(dbSyncQueryText);
            const confirmDbSync = await rlterm.question(confirmSyncText);
            if (!["U", "R"].includes(dbSyncAction.toUpperCase()) || confirmDbSync.toUpperCase() !== "CONFIRM") {
                logger.info("Database synchronisation has been aborted! Returning to menu.");
                break;
            } else {
                if (dbSyncAction.toUpperCase() === "U") {
                    logger.info("Update Sync was selected! Existing tables' data will be preserved where possible.");
                    await sync({ alter: true });
                };
                if (dbSyncAction.toUpperCase() === "R") {
                    logger.warn("Forced Sync was selected! All data in existing database will now be reset!");
                    await sync({ force: true });
                };
            };
            logger.info("Database resynchronisation operation completed.");
            process.exit(0);
        case "X":
            logger.warn("Setup aborted! Exiting utility now.");
            process.exit(0);
        default:
            logger.warn(`Unknown option "${action.substring(0, 1).toUpperCase()}"! Please re-enter option again.`);
    };
    runSetup(); // loop back to menu if not exited
};
runSetup();