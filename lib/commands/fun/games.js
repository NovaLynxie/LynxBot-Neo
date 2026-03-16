const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder } = require("discord.js");
const { permissions } = require("../../assets/schemas/common.json");
const games = require("./games/index");

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
    enabled: false, // experimental command - disabled for now
    permsLevel: permissions.commands.USER,
    restricted: false,
    // slash command functions
    autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = Object.keys(games);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
    execute(interaction) {
        const { game, subcommand } = interaction.options;
        if (subcommand === "list") {
            interaction.reply({
                content: `Available games: ${Object.keys(games).join(", ")}`
            });
            return;
        };
        if (subcommand === "play") {
            // Implement game selection logic here
            switch (game) {
                case "GAME_NAME":
                    interaction.reply({
                        content: "Starting GAME_NAME..."
                    });
                    break;
                default:
                    interaction.reply({
                        content: "I do not have that game in my collection."
                    });
            };
        };
    }
};