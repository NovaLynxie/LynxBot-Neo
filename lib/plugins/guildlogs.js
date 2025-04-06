const { EmbedBuilder, Events } = require("discord.js");

// TODO - Create guildlogs.js plugin module! (WIP)

function createGuildLogGenericEmbed(guild, data = {
    color: "#000000", title: "guildlogger.title", description: "guildlogger.description"
}) {
    const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setDescription(data.description)
    return embed;
};

// Guild Channel Log Embeds - Generates specific channel log embeds
// TODO Add guild channel log embed handlers!
function createGuildChannelCreatedEmbed(guild, channel) {};
function createGuildChannelDeletedEmbed(guild, channel) {};
function createGuildChannelUpdatedEmbed(guild, channel) {};
// Guild Member Log Embeds - Generates specific member log embeds
// TODO Add guild member log embed handlers!
function createGuildMemberJoinEmbed(guild, member) {};
function createGuildMemberLeaveEmbed(guild, member) {};
function createGuildMemberKickEmbed(guild, member) {};
function createGuildMemberBanEmbed(guild, member) {};

// Guild Logger Main Function - Handles processing for all above function calls.
async function guildLogger (event, data = {}) {
    // TODO: Implement main guild logger function.
    let embed;
    switch (event) {};
    return;
};

module.exports = guildLogger;