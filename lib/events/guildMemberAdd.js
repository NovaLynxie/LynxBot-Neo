const logger = require("../utils/logger")("events");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const guild = member.guild;
        try {
            createGuildEventLog(this.name, guild, member);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
};