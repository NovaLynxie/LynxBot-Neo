const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.bot || newMessage.author.bot) return;
        const guild = oldMessage.guild ?? newMessage.guild;
        try {
            createGuildEventLog(this.name, guild, oldMessage, newMessage);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
}