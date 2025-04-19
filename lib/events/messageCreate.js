const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { scanMessage } = require("../plugins/automod");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        await scanMessage(message);
    }
}