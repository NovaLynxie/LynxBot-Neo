const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author.bot) return;
        const guild = message.guild;
    }
}