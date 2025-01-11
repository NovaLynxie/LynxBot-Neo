const logger = require("../utils/logger")("events");
const { Events } = require("discord.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {}
};