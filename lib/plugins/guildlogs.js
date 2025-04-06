const { EmbedBuilder } = require("discord.js");

// TODO - Create guildlogs.js plugin module! (WIP)

function createGuildLogEmbed(guild, data = {}) {
    const embed = new EmbedBuilder()
        .setTitle("")
        .setDescription("")
    return embed;
};


// Guild Channel Log Embeds
// TODO Add guild channel log embed handlers!
function createGuildChannelCreatedEmbed(guild, channel) {};
function createGuildChannelDeletedEmbed(guild, channel) {};
function createGuildChannelUpdatedEmbed(guild, channel) {};
// Guild Member Log Embeds
// TODO Add guild member log embed handlers!
function createGuildMemberJoinEmbed(guild, member) {};
function createGuildMemberLeaveEmbed(guild, member) {};
function createGuildMemberKickEmbed(guild, member) {};
function createGuildMemberBanEmbed(guild, member) {};

async function guildLogger (data, channel) {
    // ...
};

module.exports = {};