const { AuditLogEvent, EmbedBuilder, Events } = require("discord.js");
const logger = require("../utils/logger")("guildlogs");

function guildLogBaseEmbed() {
    // Build guild logger embed, provide default fallback values if necessary
    const embed = new EmbedBuilder()
        .setTitle("guildlogs.title")
        .setFooter({ text: "Powered by LynxBot" })
    return embed;
};

function resolveEnumKey(enumType, enumKey) {
    const eventKeys = Object.keys(enumType).filter(key => isNaN(Number(key)));
    return eventKeys[eventKeys.indexOf(enumKey)];
};

// Guild Channel Log Embeds - Generates specific channel log embeds
// TODO: Add guild channel log embed handlers!
function guildChannelCreateEmbed(guild, channel) {
    let channelEmbed = guildLogBaseEmbed();
};
function guildChannelDeleteEmbed(guild, channel) {
    let channelEmbed = guildLogBaseEmbed();
};
function guildChannelUpdateEmbed(guild, oldChannel, newChannel) {
    let channelEmbed = guildLogBaseEmbed();
};
// Guild Member Log Embeds - Generates specific member log embeds
// TODO: Add guild member log embed handlers!
function guildMemberBanEmbed(guild, member) {
    let guildMemberEmbed = guildLogBaseEmbed();
};
function guildMemberKickEmbed(guild, member) {
    let guildMemberEmbed = guildLogBaseEmbed();
};
function guildMemberJoinEmbed(guild, member) {
    let guildMemberEmbed = guildLogBaseEmbed();
};
function guildMemberLeaveEmbed(guild, member) {
    let guildMemberEmbed = guildLogBaseEmbed();
};
function guildMemberUpdateEmbed(guild, oldMember, newMember) {
    let guildMemberEmbed = guildLogBaseEmbed();
};
// Guild Invite Log Embeds - Generates specific invite log embeds
// TODO: Add guild invite log embed handlers!
function guildInviteCreateEmbed(guild, invite) {
    let guildInviteEmbed = guildLogBaseEmbed();
};
function guildInviteDeleteEmbed(guild, invite) {
    let guildInviteEmbed = guildLogBaseEmbed();
};
// Guild Role Log Embeds - Generates specific role log embeds
// TODO: Add guild role log embed handlers!
function guildRoleCreateEmbed(guild, role) {
    let guildRoleEmbed = guildLogBaseEmbed();
};
function guildRoleDeleteEmbed(guild, role) {
    let guildRoleEmbed = guildLogBaseEmbed();
};
function guildRoleUpdateEmbed(guild, oldRole, newRole) {
    let guildRoleEmbed = guildLogBaseEmbed();
};

function createAuditEventLog(action, guild, channel, executor, target) {
    if (!guild) return logger.error(`AuditEventLog Error: ${Events.GuildAuditLogEntryCreate} called with missing "guild" parameter!`);
    let embed = guildLogBaseEmbed(); // generate guild logs base embed and stores for reference calls
    switch (action) {
        // TODO: Add Audit Log Events to be tracked.
        default:
            logger.debug(`Ignored AuditLogEvent action "${resolveEnumKey(AuditLogEvent, action)}". If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};
function createGuildEventLog(event, guild, ...args) {
    if (!guild) return logger.error(`ServerEventLog Error: ${event} called with missing "guild" parameter!`);
    let embed = guildLogBaseEmbed(); // generate guild logs base embed and stores for reference calls
    let channel, member, message; // common placeholder variables used by all log events.
    switch (event) {
        // Channel Events
        case Events.ChannelCreate:
            channel = args[0];
            break;
        case Events.ChannelDelete:
            channel = args[0];
            break;
        case Events.ChannelUpdate:
            let [oldChannel, newChannel] = args; 
            break;
        // Member Events (WIP)
        // TODO: Implement handlers for Member Events
        case Events.GuildBanAdd:
            break;
        case Events.GuildBanRemove:
            break;
        case Events.GuildMemberAdd:
            member = args[0];
            break;
        case Events.GuildMemberRemove:
            member = args[0];
            break;
        case Events.GuildMemberUpdate:
            let [oldMember, newMember] = args;
            break;
        // Message Events (WIP)
        // TODO: Implement handlers for Message Events
        case Events.MessageBulkDelete:
            let bulkMessages = args[0];
            break;
        case Events.MessageDelete:
            message = args[0];
            break;
        case Events.MessageUpdate:
            let [oldMessage, newMessage] = args;
            break;
        // Invite Events
        case Events.InviteCreate:
            break;
        case Events.InviteDelete:
            break;
        // Role Events
        case Events.GuildRoleCreate:
            break;
        case Events.GuildRoleDelete:
            break;
        case Events.GuildRoleUpdate:
            let [oldRole, newRole] = args;
            break;
        // Voice Events (WIP)
        // TODO: Implement handlers for Voice Events
        case Events.VoiceServerUpdate:
            break;
        case Events.VoiceStateUpdate:
            break;
        // alert if unknown event was called, this is helpful for debugging event calls.
        default:
            logger.debug(`Ignored event "${resolveEnumKey(Events, event)}". If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};

module.exports = { createAuditEventLog, createGuildEventLog };