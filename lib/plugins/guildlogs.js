const { EmbedBuilder } = require("discord.js");

// TODO - Create guildlogs.js plugin module!

function createGuildLogEmbed(guild, data = {}) {
    const embed = new EmbedBuilder()
        .setTitle("")
        .setDescription("")
    return embed;
};

function createGuildMemberJoinEmbed(guild, member) {};
function createGuildMemberLeaveEmbed(guild, member) {};

module.exports = {};