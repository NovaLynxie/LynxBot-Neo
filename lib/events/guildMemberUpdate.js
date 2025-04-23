const logger = require("../utils/logger")("events");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const guild = oldMember.guild ?? newMember.guild;
        createGuildEventLog(this.name, guild, oldMember, newMember);
    }
};