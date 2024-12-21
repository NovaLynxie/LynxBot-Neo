const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Bot App Help"),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        await interaction.reply({
            content: "HELP_COMMAND_PLACEHOLDER",
            ephemeral: true
        });
    }
}