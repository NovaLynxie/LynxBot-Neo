const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder } = require("discord.js");
const { permissions } = require("../../assets/schemas/common.json");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("image")
        .setDescription("Image commands"),
    // slash command parameters
    enabled: true,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async autocomplete(interaction) {},
    async execute(interaction) {
        // TODO - ???
    }
};