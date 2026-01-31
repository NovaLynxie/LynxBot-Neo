const { AuditLogEvent, ChannelType, EmbedBuilder, Events, channelMention, codeBlock, time } = require("discord.js");
const { stripIndents } = require("common-tags");
const logger = require("../utils/logger")("guildlogs");

function resolveEventEnumKey(enumType, enumKey) {
    const eventKeys = Object.keys(enumType).filter(key => isNaN(Number(key)));
    return eventKeys[eventKeys.indexOf(enumKey)];
};
function createGuildLogEmbed() { // create guild log embeds here. change colors, footers, etc here to apply to all guild logs.
    return new EmbedBuilder() // initializes new embed instance for guild logs
        .setColor("LightGrey") // default embed color for guild logs
        .setFooter({ text: "Powered by LynxBot", iconURL: guild.client.user.displayAvatarURL({ dynamic: true }) });
};
function generatePermissionDiff(oldPerms, newPerms) {
    const oldPermArray = oldPerms.toArray(); // convert old permissions to array
    const newPermArray = newPerms.toArray(); // convert new permissions to array
    const grantedPerms = newPermArray.filter(perm => !oldPermArray.includes(perm));
    const revokedPerms = oldPermArray.filter(perm => !newPermArray.includes(perm));
    return `${grantedPerms.map(perm => `+ ${perm}`).join("\n")}\n${revokedPerms.map(perm => `- ${perm}`).join("\n")}`; // return formatted permission diff string
};
function generateOverridePermissionDiff(oldPerms, newPerms) {
    const oldAllowArray = oldPerms.allow.toArray();
    const oldDenyArray = oldPerms.deny.toArray();
    const newAllowArray = newPerms.allow.toArray();
    const newDenyArray = newPerms.deny.toArray();
    const grantedPerms = newAllowArray.filter(perm => !oldAllowArray.includes(perm));
    const revokedPerms = oldDenyArray.filter(perm => !newDenyArray.includes(perm));
    return `${grantedPerms.map(perm => `+ ${perm}`).join("\n")}\n${revokedPerms.map(perm => `- ${perm}`).join("\n")}`; // return formatted permission diff string
};

async function createAuditEventLog(action, guild, channel, executor, target) {
    if (!guild) return logger.error(`AuditEventLog Error: ${Events.GuildAuditLogEntryCreate} called with missing "guild" parameter!`);
    let auditEventLogEmbed = createGuildLogEmbed(); // generate guild logs base embed and stores for reference calls
    switch (action) {
        // TODO: Add Audit Log Events to be tracked.
        case AuditLogEvent.MemberBanAdd:
            break;
        case AuditLogEvent.MemberBanRemove:
            break;
        case AuditLogEvent.MemberKick:
            break;
        case AuditLogEvent.MemberPrune:
            break;
        default:
            logger.debug(`AuditLogEvent action "${resolveEventEnumKey(AuditLogEvent, action)}" received, this is either unknown or not currently tracked! If you think this is an error, please contact my developer.`);
    };
    embed.setTimestamp() // adds current date timestamp before sending completed embed
};
async function createGuildEventLog(event, guild, ...args) {
    if (!guild) return logger.error(`ServerEventLog Error: ${event} called with missing "guild" parameter!`);
    const client = guild.client; // fetch client instance from guild object.
    const guildLogEmbed = createGuildLogEmbed(); // generate guild logs base embed and stores for reference calls
    let channel, member, invite, role; // common shared variables used by all log events.
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
            let channelType = oldChannel.type || newChannel.type;
            let updated = []; // array to hold updated values //updated.join("\n");
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
            if (channelType === ChannelType.GuildText || channelType === ChannelType.GuildAnnouncement) { // text-based channel updates
                if (oldChannel.topic !== newChannel.topic) {
                    guildLogEmbed.addFields({
                      name: "Topic Updated",
                      value: stripIndents`
                            Old: "${oldChannel.topic ?? "None"}"
                            New: "${newChannel.topic ?? "None"}"
                        `,
                      inline: true,
                    });
                };
                if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                    guildLogEmbed.addFields({
                        name: "Slowmode Updated",
                        value: stripIndents`
                            Old: ${oldChannel.rateLimitPerUser} seconds
                            New: ${newChannel.rateLimitPerUser} seconds
                        `,
                        inline: true
                    });
                }; 
                if (oldChannel.nsfw !== newChannel.nsfw) {
                    guildLogEmbed.addFields({
                        name: "Age Restricted Status Updated!",
                        value: `Changed from ${oldChannel.nsfw ? "NSFW" : "SFW"} to ${newChannel.nsfw ? "NSFW" : "SFW"}`,
                        inline: true
                    });
                };
            };
            if (channelType === ChannelType.GuildForum) { // forum channel updates
                if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration) {
                    guildLogEmbed.addFields({
                        name: "Default Auto-Archive Duration Updated",
                        value: stripIndents`
                            Old: ${oldChannel.defaultAutoArchiveDuration} minutes
                            New: ${newChannel.defaultAutoArchiveDuration} minutes
                        `,
                    });
                };
            };
            if (channelType === ChannelType.GuildVoice || channelType === ChannelType.GuildStageVoice) { // voice-based channel updates
                if (oldChannel.bitrate !== newChannel.bitrate) {
                    guildLogEmbed.addFields({
                        name: "Bitrate Updated",
                        value: stripIndents`
                            Old: ${oldChannel.bitrate} bps
                            New: ${newChannel.bitrate} bps
                        `,
                    });
                };
                if (oldChannel.userLimit !== newChannel.userLimit) {
                    guildLogEmbed.addFields({
                        name: "User Limit Updated",
                        value: stripIndents`
                            Old: ${oldChannel.userLimit === 0 ? "No Limit" : oldChannel.userLimit}
                            New: ${newChannel.userLimit === 0 ? "No Limit" : newChannel.userLimit}
                        `,
                    });
                };
            };
            if (oldChannel.permissionOverwrites.cache.size > newChannel.permissionOverwrites.cache.size) {
                // TODO: Add channel overwrites logic...?
            };
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
            guildLogEmbed
                .setTitle("User Pardoned")
                .setThumbnail(oldGuildBan.user.displayAvatarURL({ dynamic: true }))
                .setFields(
                    { name: "Reason", value: newGuildBan.reason ?? "No reason provided." }
                )
            break;
        case Events.GuildMemberAdd:
            member = args[0];
            if (member.partial) member = await member.fetch(); // if partial, fetch full member data!
            guildLogEmbed
                .setTitle("New Member Joined")
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
            if (member.partial) member = await member.fetch(); // if partial, fetch full member data!
            guildLogEmbed
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
            if (oldMember.partial) oldMember = await oldMember.fetch(); // if partial, fetch full member data!
            if (newMember.partial) newMember = await newMember.fetch(); // if partial, fetch full member data!
            guildLogEmbed
                .setTitle("Member Profile Update")
                .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                .setFields(
                    {
                        name: "User Details",
                        value: stripIndents`
                            Username: ${oldMember.user.username !== newMember.user.username || oldMember.user.tag !== newMember.user.tag ? `${newMember.user.username ?? newMember.user.tag} (was ${oldMember.user.username ?? oldMember.user.tag})` : `${newMember.user.username ?? newMember.user.tag}`}
                            Created: ${time(newMember.user.createdAt)} (${time(newMember.user.createdAt, "R")})
                            Joined: ${time(newMember.joinedAt)} (${time(newMember.joinedAt, "R")})`,
                    },
                    {
                        name: "Member Details",
                        value: stripIndents`
                            Nickname: ${oldMember.nickname !== newMember.nickname ? `${newMember.nickname ?? "None"} (was ${oldMember.nickname ?? "None"})` : `${newMember.nickname ?? "None"}`}

                        `
                    }
                );
            if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
                const oldRoles = oldMember.roles.cache;
                const newRoles = newMember.roles.cache;
                const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
                const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));
                if (addedRoles.size > 0) {
                    guildLogEmbed
                        .addFields(
                            {
                                name: `Roles Added (${addedRoles.size})`,
                                value: addedRoles.map(role => `<@&${role.id}>`).join(", ")
                            }
                        );
                };
                if (removedRoles.size > 0) {
                    guildLogEmbed
                        .addFields(
                            {
                                name: `Roles Removed (${removedRoles.size})`,
                                value: removedRoles.map(role => `<@&${role.id}>`).join(", ")
                            }
                        );
                };
            };
            break;
        // Message Events (WIP)
        // TODO: Implement handlers for Message Events
        case Events.MessageBulkDelete:
            let bulkMessages = args[0];
            guildLogEmbed
                .setTitle("Bulk Message Deletion")
                .setFields(
                    {
                        name: "Message Deletion Details",
                        value: stripIndents`
                        Channel: ${channelMention(bulkMessages.first().channel.id)}
                        Deleted At: ${time(new Date(), "F")}
                        Messages Deleted: ${bulkMessages.size}
                        Attached Files: ${bulkMessages.filter(msg => msg.attachments.size > 0).size}
                        `
                    }
                );
            if (bulkMessages.filter(msg => msg.attachments.size > 0).size > 0) {
                guildLogEmbed
                    .addFields(
                        {
                            name: `Attachments (${bulkMessages.filter(msg => msg.attachments.size > 0).size})`,
                            value: bulkMessages.filter(msg => msg.attachments.size > 0).map(msg => msg.attachments.map(att => `[${att.name}](<${att.url}>)`).join("\n")).join("\n")
                        }
                    );
            };
            break;
        case Events.MessageDelete:
            let message = args[0];
            guildLogEmbed
                .setTitle("Message Deleted")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFields(
                    {
                        name: "Message Details",
                        value: stripIndents`
                        ${message.author} (${message.author.tag})
                        Channel: ${channelMention(message.channel.id)}
                        Deleted At: ${time(new Date(), "F")}
                        Message ID: ${message.id},
                        `
                    },
                    { name: "Message Content", value: message.content || "*No Content Available!*" }
                );
            if (message.attachments.size > 0) {
                guildLogEmbed
                    .addFields(
                        { name: `Attachments (${message.attachments.size})`, value: message.attachments.map(att => `[${att.name}](<${att.url}>)`).join("\n") }
                    );
            };
            break;
        case Events.MessageUpdate:
            let [oldMessage, newMessage] = args;
            guildLogEmbed
                .setTitle("Message Updated")
                .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
                .setFields(
                    {
                        name: "Message Details",
                        value: stripIndents`
                        ${newMessage.author} (${newMessage.author.tag})
                        Channel: ${channelMention(newMessage.channel.id)}
                        Message ID: ${newMessage.id}
                        `
                    },
                    {
                        name: "Old Message Content",
                        value: oldMessage.content || "*No Content Available!*"
                    },
                    {
                        name: "New Message Content",
                        value: newMessage.content || "*No Content Available!*"
                    }
                );
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
            guildLogEmbed
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
            guildLogEmbed
                .setTitle("New Role Created!")
                .setFields(
                    {
                        name: "Role Details", value: stripIndents`
                        Name: ${role.name}
                        Color: ${role.hexColor}
                        Hoist? ${role.hoist ? "Yes" : "No"}
                        Mentionable? ${role.mentionable ? "Yes" : "No"}`
                    }
                );
            break;
        case Events.GuildRoleDelete:
            role = args[0];
            guildLogEmbed
                .setTitle("Role Deleted!")
                .setFields(
                    {
                        name: "Role Details", value: stripIndents`
                        Name: ${role.name}
                        Color: ${role.hexColor}
                        Hoist? ${role.hoist ? "Yes" : "No"}
                        Mentionable? ${role.mentionable ? "Yes" : "No"}`
                    }
                );
            break;
        case Events.GuildRoleUpdate:
            let [oldRole, newRole] = args;
            guildLogEmbed
                .setTitle("Role Updated!")
                .setFields(
                    {
                        name: "Role Details", value: stripIndents`
                        Name: ${(oldRole.name !== newRole.name) ? `${newRole.name} (was ${oldRole.name})` : newRole.name}
                        Color: ${(oldRole.hexColor !== newRole.hexColor) ? `${newRole.hexColor} (was ${oldRole.hexColor})` : newRole.hexColor}
                        Hoist? ${(oldRole.hoist !== newRole.hoist) ? `${newRole.hoist ? "Yes" : "No"} (was ${oldRole.hoist ? "Yes" : "No"})` : newRole.hoist ? "Yes" : "No"}
                        Mentionable? ${(oldRole.mentionable !== newRole.mentionable) ? `${newRole.mentionable ? "Yes" : "No"} (was ${oldRole.mentionable ? "Yes" : "No"})` : newRole.mentionable ? "Yes" : "No"}`
                    }
                );
            if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
                const generateRolePermissionChanges = (oldPerms, newPerms) => {
                    const oldPermArray = oldPerms.toArray();
                    const newPermArray = newPerms.toArray();
                    const grantedPerms = newPermArray.filter(perm => !oldPermArray.includes(perm));
                    const revokedPerms = oldPermArray.filter(perm => !newPermArray.includes(perm));
                    let permDiffString = `${grantedPerms.map(perm => `+ ${perm}`).join("\n")}\n${revokedPerms.map(perm => `- ${perm}`).join("\n")}`;
                    return permDiffString; // return formatted permission diff string
                };
                guildLogEmbed.addFields({
                  name: "Permissions Updated",
                  value: codeBlock(
                    "diff",
                    generateRolePermissionChanges(
                      oldRole.permissions,
                      newRole.permissions,
                    ),
                  ),
                });
            };
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
    guildLogEmbed.setTimestamp(); // adds current date timestamp before sending completed guildLogEmbed
};

module.exports = { createAuditEventLog, createGuildEventLog };