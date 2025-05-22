const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.ChannelDelete,
    async execute(channel) {
        const guild = channel.guild;
        try {
            createGuildEventLog(this.name, guild, channel);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
}