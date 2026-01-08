const { readdirSync } = require("node:fs");
const path = require("node:path");
const gameFiles = readdirSync("./lib/commands/fun/games").filter(file => file.endsWith(".game.js"));
gameFiles.forEach(file => {
    console.log(file);
    console.log(path.resolve(`lib/commands/fun/games/${file}`));
    let module = require(path.resolve(`lib/commands/fun/games/${file}`));
    exports[file.split(".game")[0]] = module;
});