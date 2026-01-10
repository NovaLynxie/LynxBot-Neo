// DEPRECATED: Use "npm run setup" command instead. Will remove in favour of the setup script.
require("dotenv").config(); // load environment variables
// external libraries
const { REST, Routes } = require("discord.js");
// internal libraries
const logger = require("./logger")("setup/deploy");
const { models } = require("./storage");
const path = require("node:path");
const { readdirSync } = require("node:fs");
const readline = require("node:readline/promises");
// initialise discord REST interface
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
// initialise command line interface
const rlci = readline.createInterface({
    input: process.stdin, output: process.stdout
});
// commands deploy functions
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
(async function runSetup () {
    let action = ""; // application local variables
    // output debug values in verbose, used for debugging only!
    logger.verbose(`ClientID=${process.env.CLIENT_ID ? process.env.CLIENT_ID : "N/A"}`);
    logger.verbose(`GuildID=${process.env.GUILD_ID ? process.env.GUILD_ID : "N/A"}`);
    // check if required variables are set before continuing
    if (!process.env.DISCORD_TOKEN) return logger.error("Missing required Discord Bot Token!");
    if (!process.env.CLIENT_ID) return logger.error("No Client Application ID was provided!");
    action = await rlci.question("< Commands Setup Utility v1.0 > \n[1] Deploy \n[2] Remove \n[X] Cancel \nPlease select option: ");
    switch (action.substring(0, 1).toString().toUpperCase()) {
        case "0":
        case "X":
            logger.warn("Cancelled setup! Exiting now.");
            break;
        case "1":
        case "D":
            await deployCommands();
            break;
        case "2":
        case "R":
            await removeCommands();
            break;
        default:
            logger.warn("Invalid response called, action aborted.");
            await runSetup();
    };
    process.exit(0); // exit deploy script here
})();