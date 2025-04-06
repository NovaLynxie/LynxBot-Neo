const { EmbedBuilder, Events } = require("discord.js");

// TODO: Create guildlogs.js plugin module! (WIP)

function guildLogBaseEmbed(guild, data = {}) {
    // Build guild logger embed, provide default fallback values if necessary
    const embed = new EmbedBuilder()
        .setTitle(data.title ?? "guildlogger.title")
        .setDescription(data.description ?? "guildlogger.description")
        .setTimestamp() // adds current date timestamp
        .setFooter({ text: "Powered by LynxBot" })
    return embed;
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

module.exports = {};

// DEPRECATED! NOT IN USE, REPLACING WITH INDIVIDUAL EMBED CALLS DIRECTLY!
// Guild Logger Main Function - Handles processing for all above function calls.
/*
async function guildLogger(event, guild, ...args) {
    if (!event) return; // abort call if "event" is not defined or null in function parameter.
    if (!guild) return logger.warn(`${event} tried to call guildLogger with undefined or null "guild" parameter!`);
    if (!args || args.length == 0) logger.debug(`${event} tried to call guildLogger with less than one args parameter!`);
    // TODO: Implement main guild logger function.
    let channel, embed; // local variable for storing log channel to send to and event embed to be sent.
    switch (event) {
        // Channel Events
        case Events.ChannelCreate:
            embed = guildChannelCreateEmbed(guild, args[0]);
            break;
        case Events.ChannelDelete:
            embed = guildChannelDeleteEmbed(guild, args[0]);
            break;
        case Events.ChannelUpdate:
            embed = guildChannelUpdateEmbed(guild, args[0], args[1]);
            break;
        // Member Events (WIP)
        // TODO: Implement handlers for Member Events
        case Events.GuildBanAdd:
            break;
        case Events.GuildBanRemove:
            break;
        case Events.GuildMemberAdd:
            break;
        case Events.GuildMemberRemove:
            break;
        case Events.GuildMemberUpdate:
            break;
        // Message Events (WIP)
        // TODO: Implement handlers for Message Events
        case Events.MessageBulkDelete:
            break;
        case Events.MessageDelete:
            break;
        case Events.MessageUpdate:
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
            break;
        // Voice Events (WIP)
        // TODO: Implement handlers for Voice Events
        case Events.VoiceServerUpdate:
            break;
        case Events.VoiceStateUpdate:
            break;
        // send a message in console if an unknown event was called, this is helpful for debugging incorrect event calls.
        default:
            logger.debug(`An unknown event "${event}" was called in guildLogger! If you think this is an error, please contact my developer.`);
    };
    try {
        await channel.send({ embeds: [embed] });
    } catch(err) {
        logger.error(`${err.name}: ${err.message}`);
        logger.debug(err.stack);
    };
};
*/
// DEPRECATED! NOT IN USE, REPLACING WITH INDIVIDUAL EMBED CALLS DIRECTLY!
