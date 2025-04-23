const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot || newMessage.author.bot) return;
        const guild = oldMessage.guild ?? newMessage.guild;
    }
}