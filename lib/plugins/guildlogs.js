const { stripIndents } = require("common-tags");
const { AuditLogEvent, EmbedBuilder, Events, channelMention, time } = require("discord.js");
const logger = require("../utils/logger")("guildlogs");

function resolveEventEnumKey(enumType, enumKey) {
    const eventKeys = Object.keys(enumType).filter(key => isNaN(Number(key)));
    return eventKeys[eventKeys.indexOf(enumKey)];
};

async function createAuditEventLog(action, guild, channel, executor, target) {
    if (!guild) return logger.error(`AuditEventLog Error: ${Events.GuildAuditLogEntryCreate} called with missing "guild" parameter!`);
    let embed = guildLogBaseEmbed(); // generate guild logs base embed and stores for reference calls
    switch (action) {
        // TODO: Add Audit Log Events to be tracked.
        default:
            logger.debug(`Ignored AuditLogEvent action "${resolveEventEnumKey(AuditLogEvent, action)}". If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};
async function createGuildEventLog(event, guild, ...args) {
    if (!guild) return logger.error(`ServerEventLog Error: ${event} called with missing "guild" parameter!`);
    const client = guild.client; // fetch client instance from guild object.
    const guildLogEmbed = new EmbedBuilder() // generate guild logs base embed and stores for reference calls
        .setTitle("guildlogs.title")
        .setFooter({ text: "Powered by LynxBot", iconURL: client.user.displayAvatarURL({ dynamic: true }) });
    let channel, member, invite, role; // common placeholder variables used by all log events.
    switch (event) {
        // Channel Events
        case Events.ChannelCreate:
            channel = args[0];
            guildLogEmbed
                .setTitle("Channel Created!")
                .setFields(
                    {
                        name: "Channel Details", value: stripIndents`
                        Name: ${channel.name}
                        Type: ${channel.type}
                        Link: ${channelMention(channel.id)}`
                    }
                );
            break;
        case Events.ChannelDelete:
            channel = args[0];
            guildLogEmbed
                .setTitle("Channel Deleted!")
                .setFields(
                    {
                        name: "Channel Details", value: stripIndents`
                        Name: ${channel.name}
                        Type: ${channel.type}`
                    }
                );
            break;
        case Events.ChannelUpdate:
            let [oldChannel, newChannel] = args;
            guildLogEmbed
                .setTitle("Channel Updated!")
                .setFields(
                    {
                        name: "Channel Details", value: stripIndents`
                        Name: ${(oldChannel.name !== newChannel.name) ? `${newChannel.name} (was ${oldChannel.name})` : newChannel.name}
                        Type: ${newChannel.type}
                        Link: ${channelMention(newChannel.id)}`
                    }
                );
            break;
        // Member Events (WIP)
        // TODO: Implement handlers for Member Events
        case Events.GuildBanAdd:
            let newGuildBan = args[0];
            if (newGuildBan.partial) newGuildBan = await newGuildBan.fetch(); // if partial, fetch full guildban data!
            guildLogEmbed
                .setTitle("User Banned!")
                .setThumbnail(newGuildBan.user.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { name: "Reason", value: newGuildBan.reason ?? "No reason provided." }
                )
            break;
        case Events.GuildBanRemove:
            let oldGuildBan = args[0];
            if (oldGuildBan.partial) oldGuildBan = await oldGuildBan.fetch(); // if partial, fetch full guildban data!
            embed
                .setTitle("User Pardoned")
                .setThumbnail(oldGuildBan.user.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { name: "Reason", value: newGuildBan.reason ?? "No reason provided." }
                )
            break;
        case Events.GuildMemberAdd:
            member = args[0];
            embed
                .setTitle("Member Join")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { 
                        name: "User Details",
                        value: stripIndents`
                            Username: ${member.user.tag ?? member.user.username}
                            Created: ${time(member.user.createdAt)} (${time(member.user.createdAt, "R")})
                            Joined: ${time(member.joinedAt)} (${time(member.joinedAt, "R")})
                        `
                    }
                )
            break;
        case Events.GuildMemberRemove:
            member = args[0];
            embed
                .setTitle("Member Left")
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { 
                        name: "User Details",
                        value: stripIndents`
                            Username: ${member.user.tag ?? member.user.username}
                            Created: ${time(member.user.createdAt)} (${time(member.user.createdAt, "R")})
                            Joined: ${time(member.joinedAt)} (${time(member.joinedAt, "R")})
                        `
                    }
                )
            break;
        case Events.GuildMemberUpdate:
            let [oldMember, newMember] = args;
            embed
                .setTitle("Member Profile Update")
                .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { 
                        name: "User Details",
                        value: stripIndents`
                            Username: ${(oldMember.user.tag !== newMember.user.tag) ? `${newMember.user.tag ?? newMember.user.username} (was ${oldMember.user.tag ?? oldMember.user.username})` : newMember.user.tag }
                            Created: ${time(member.user.createdAt)} (${time(member.user.createdAt, "R")})
                            Joined: ${time(member.joinedAt)} (${time(member.joinedAt, "R")})
                        `
                    }
                );
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
            invite = args[0]; // retrieve invite object
            // fetch full invite object if possible
            try {
                invite = await guild.invites.fetch({ code: invite.code, force: true });
            } catch (err) {
                logger.warn("Failed to fetch full invite object! Some details may be missing.");
            };
            embed
                .setTitle("New Invite Created!")
                .setThumbnail(invite.inviter.displayAvatarURL({ dynamic: true }))
                .setFields(
                    {
                        name: "Invite Details",
                        value: stripIndents`
                            Invite Code: ${invite.code}
                            Expires? ${(invite.expiresAt) ? time(invite.expiresAt, "F") : "Never"}
                            Created by ${invite.inviter} at ${time(invite.createdAt, "F")}
                        `
                    }
                )
            break;
        case Events.InviteDelete: // Unused
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
            logger.debug(`Ignored event "${resolveEventEnumKey(Events, event)}". If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};

module.exports = { createAuditEventLog, createGuildEventLog };