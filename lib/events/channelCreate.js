const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");
const { createGuildEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        const guild = channel.guild;
        createGuildEventLog(this.name, guild, channel);
    }
}