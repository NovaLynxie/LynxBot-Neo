const { EmbedBuilder, Events } = require("discord.js");

// TODO: Create guildlogs.js plugin module! (WIP)

function createGuildLogBaseEmbed(guild, data = {}) {
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
function createGuildChannelCreatedEmbed(guild, channel) {
    let channelEmbed = createGuildLogBaseEmbed();
};
function createGuildChannelDeletedEmbed(guild, channel) {
    let channelEmbed = createGuildLogBaseEmbed();
};
function createGuildChannelUpdatedEmbed(guild, oldChannel, newChannel) {
    let channelEmbed = createGuildLogBaseEmbed();
};
// Guild Member Log Embeds - Generates specific member log embeds
// TODO: Add guild member log embed handlers!
function createGuildMemberKickEmbed(guild, member) {
    let guildMemberEmbed = createGuildLogBaseEmbed();
};
function createGuildMemberBanEmbed(guild, member) {
    let guildMemberEmbed = createGuildLogBaseEmbed();
};
function createGuildMemberJoinEmbed(guild, member) {
    let guildMemberEmbed = createGuildLogBaseEmbed();
};
function createGuildMemberLeaveEmbed(guild, member) {
    let guildMemberEmbed = createGuildLogBaseEmbed();
};
function createGuildMemberUpdateEmbed(guild, oldMember, newMember) {
    let guildMemberEmbed = createGuildLogBaseEmbed();
};
// Guild Invite Log Embeds - Generates specific invite log embeds
// TODO: Add guild invite log embed handlers!
function createGuildInviteCreatedEmbed(guild, invite) {
    let guildInviteEmbed = createGuildLogBaseEmbed();
};
function createGuildInviteLeletedEmbed(guild, invite) {
    let guildInviteEmbed = createGuildLogBaseEmbed();
};
// Guild Role Log Embeds - Generates specific role log embeds
// TODO: Add guild role log embed handlers!
function createGuildRoleCreatedEmbed(guild, role) {
    let guildRoleEmbed = createGuildLogBaseEmbed();
};
function createGuildRoleDeletedEmbed(guild, role) {
    let guildRoleEmbed = createGuildLogBaseEmbed();
};
function createGuildRoleUpdatedEmbed(guild, role) {
    let guildRoleEmbed = createGuildLogBaseEmbed();
};

// Guild Logger Main Function - Handles processing for all above function calls.
async function guildLogger(event, ...args) {
    if (!event) return; // abort call if "event" is not defined or null in function parameter.
    if (!data) return logger.warn(`${event} tried to call guildLogger with undefined or null data!`);
    // TODO: Implement main guild logger function.
    let channel, embed; // local variable for storing log channel to send to and event embed to be sent.
    switch (event) {
        // Channel Events
        case Events.ChannelCreate:
            break;
        case Events.ChannelDelete:
            break;
        case Events.ChannelUpdate:
            break;
        // Member Events (WIP)
        case Events.EVENTNAME:
            break;
        // Message Events
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

module.exports = guildLogger;