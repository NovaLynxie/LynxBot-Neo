const logger = require("../../../utils/logger")("gamesloader");
const { readdirSync } = require("node:fs");
const path = require("node:path");
const gameFiles = readdirSync("./lib/commands/fun/games").filter(file => file.endsWith(".game.js"));
gameFiles.forEach(file => {
    logger.debug(`Loading game module: ${file}`);
    logger.debug(path.resolve(`lib/commands/fun/games/${file}`));
    let module = require(path.resolve(`lib/commands/fun/games/${file}`));
    exports[file.split(".game")[0]] = module;
});