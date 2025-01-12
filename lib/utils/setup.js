require("dotenv").config();
const logger = require("./logger")("deploy");
const { models, sync } = require("./storage");
const path = require("node:path");
const { readdirSync } = require("node:fs");
const readline = require("node:readline/promises");
const rlterm = readline.createInterface({ input: process.stdin, output: process.stdout });
const { REST, Routes } = require("discord.js");
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
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
    return commands;
};
async function deployCommands() {
    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: fetchCommands() }
        );
        logger.info(`Synced ${data.length} commands to application:${process.env.CLIENT_ID}`);
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
        logger.info("Successfully removed all commands from application!");
    } catch (err) {
        logger.error(`${err.code}: ${err.message}`);
        logger.debug(err.stack);
        logger.error(`Failed to delete application commands "${command.name}"!`);
        process.exit(-1);
    };
};
function database() {
    for (const category of Object.keys(models)) {
        const categories = Object.keys(models[category]);
        if (categories.length <= 0) continue;
        for (const model of Object.keys(models[category])) {
            console.log(`${model} (${category})`);
        };
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
    logger.info("LynxBot Setup Utility v1.0");
    logger.debug(`ClientID=${process.env.CLIENT_ID ? process.env.CLIENT_ID : "N/A"}`);
    logger.debug(`GuildID=${process.env.GUILD_ID ? process.env.GUILD_ID : "N/A"}`);
    /*
    const option = await rlterm.question("[C]OMMANDS \n[D]ATABASE \nSelect option: ");
    switch (option.substring(0, 1).toUpperCase()) {
        case "":
            break;
    };
    */
    const action = await rlterm.question("[I]NSTALL or [U]NINSTALL commands? "); 
    switch (action.substring(0, 1).toUpperCase()) {
        case "I":
            await deployCommands();
            break;
        case "U":
            await removeCommands();
            break;
        default:
            logger.warn(`Unknown option "${action.substring(0, 1).toUpperCase()}"! Please run setup again.`);
    };
    process.exit(0);
};
runSetup();