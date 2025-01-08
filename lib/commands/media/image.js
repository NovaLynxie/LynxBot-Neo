const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("image")
        .setDescription("Images")
        .setContexts(InteractionContextType.Guild),
    // slash command parameters
    disabled: true,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        // TODO - ???
    }
};