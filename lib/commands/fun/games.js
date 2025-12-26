const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder } = require("discord.js");
//const games = require("./games/index");
module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("games")
        .setDescription("A collection of fun games to play with your friends!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List all my available games")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play a game with your friends!")
                .addStringOption(option => 
                    option
                        .setName("game")
                        .setDescription("The name of the game to play")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        ),
    // slash command parameters
    disabled: true,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    autocomplete(interaction) {},
    execute(interaction) {
        const { game } = interaction.options;
        // Implement game selection logic here
        switch (game) {
            case "GAME_NAME":
                interaction.reply("Playing GAME_NAME!");
                break;
            default:
                interaction.reply("Game not found.");
        }
    }
};