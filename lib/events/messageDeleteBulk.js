const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.MessageBulkDelete,
    async execute(messages) {
        const guild = message.guild;
        try {
            await createGuildEventLog(this.name, guild, messages);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
}