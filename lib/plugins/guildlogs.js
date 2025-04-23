const { AuditLogEvent, EmbedBuilder, Events } = require("discord.js");
const logger = require("../utils/logger")("guildlogs");

function resolveEnumKey(enumType, enumKey) {
    const eventKeys = Object.keys(enumType).filter(key => isNaN(Number(key)));
    return eventKeys[eventKeys.indexOf(enumKey)];
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
    const client = guild.client; // fetch client instance from guild object.
    const embed = new EmbedBuilder() // generate guild logs base embed and stores for reference calls
        .setTitle("guildlogs.title")
        .setFooter({ text: "Powered by LynxBot", iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    let channel, member, invite, role; // common placeholder variables used by all log events.
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
            embed
                .setTitle("Member Join")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            break;
        case Events.GuildMemberRemove:
            member = args[0];
            embed
                .setTitle("Member Left")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            break;
        case Events.GuildMemberUpdate:
            let [oldMember, newMember] = args;
            embed
                .setTitle("Member Profile Update")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            break;
        // Message Events (WIP)
        // TODO: Implement handlers for Message Events
        case Events.MessageBulkDelete:
            let bulkMessages = args[0];
            break;
        case Events.MessageDelete:
            let message = args[0];
            break;
        case Events.MessageUpdate:
            let [oldMessage, newMessage] = args;
            break;
        // Invite Events
        case Events.InviteCreate:
            invite = args[0];
            break;
        case Events.InviteDelete:
            invite = args[0];
            break;
        // Role Events
        case Events.GuildRoleCreate:
            role = args[0];
            break;
        case Events.GuildRoleDelete:
            role = args[0];
            break;
        case Events.GuildRoleUpdate:
            let [oldRole, newRole] = args;
            break;
        // Voice Events (WIP)
        // TODO: Implement handlers for Voice Events
        /* 
         * [DISABLED FOR NOW!]
        case Events.VoiceServerUpdate:
            break;
        case Events.VoiceStateUpdate:
            break;
         * [DISABLED FOR NOW!]
         */
        // alert if unknown event was called, this is helpful for debugging event calls.
        default:
            logger.debug(`Ignored event "${resolveEnumKey(Events, event)}". If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};

module.exports = { createAuditEventLog, createGuildEventLog };