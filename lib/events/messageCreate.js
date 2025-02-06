const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(message) {
        if (message.author.bot) return;
    }
}