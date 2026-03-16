const logger = require("../../utils/logger");
const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, time } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers
        )
        .setDescription("Bans mentioned member from this server.")
        .addUserOption(option => 
            option
                .setName("target")
                .setDescription("User to ban")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("soft")
                .setDescription("Is this ban temporary?")
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for ban")
        ),
    // slash command parameters
    enabled: false,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async execute(interaction) {
        const { client, member, options } = interaction;
        const target = options.getMember("target");
        const reason = options.getString("reason");
        if (target.user.id === client.user.id) return interaction.reply({
            content: "I'm sorry but I cannot comply with this command. Please use Discord's built-in `ban` command instead.",
            flags: MessageFlags.Ephemeral
        });
        if (target.user.id === member.user.id) return interaction.reply({
            content: "Moderation safety protocol violation! I cannot allow you to do that on yourself.",
            flags: MessageFlags.Ephemeral
        });
        await interaction.reply({
            content: `Are you sure you want to ban ${userMention(target.user.id)}?`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("ban_confirm")
                    .setEmoji("🔨")
                    .setLabel("Confirm")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("ban_cancel")
                )
            ],
            flags: MessageFlags.Ephemeral
        }).then(() => {
            channel.awaitMessageComponent({ errors: ["time"], max: 1, time: 60_000 })
            .then(async (res) => {
                if (res.customId === "ban_confirm") {
                    try {
                        if (member.bannable) {
                            await member.ban({ reason: reason });
                            const date = new Date(), duration = 5000, unbanLifted = date.getTime() + duration;
                            if (options.getBoolean("soft"))
                                setTimeout(async () => await guild.members.unban(member.user.id, "User was softbanned. This is an automated action."), duration);
                            await interaction.editReply({
                                content: `${member} has been removed from this server. They will be able to rejoin in ${time(new Date(unbanLifted), 'T')}`,
                                flags: MessageFlags.Ephemeral
                            });
                        } else {
                            await interaction.editReply({
                                content: `${member} has been banned from this server.`,
                                flags: MessageFlags.Ephemeral
                            });
                        };
                    } catch (err) {
                        logger.error(`${err.name}: ${err.message}`);
                        logger.error(`An error occurred while banning user "${member.displayName}" from "${member.guild.name}"`);
                        await interaction.editReply({
                            content: `Failed to ban ${member} from this server.`,
                            flags: MessageFlags.Ephemeral
                        });
                    };
                }
            });
        }).catch(async () => {
            return interaction.editReply({
                content: "No response received from user. Aborting action.",
                components: [],
                flags: MessageFlags.Ephemeral
            })
        });
    }
};