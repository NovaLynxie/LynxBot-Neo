const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author.bot) return;
        const guild = message.guild;
        try {
            createGuildEventLog(this.name, guild, message);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
}