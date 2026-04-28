const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        const guild = oldChannel.guild ?? newChannel.guild;
        try {
            createGuildEventLog(this.name, guild, oldChannel, newChannel);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
}