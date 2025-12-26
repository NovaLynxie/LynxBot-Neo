const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("games")
        .setDescription("A collection of fun games to play with your friends!")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play a game with your friends!")
                .addStringOption(option => 
                    option
                        .setName("name")
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
    execute(interaction) {}
}