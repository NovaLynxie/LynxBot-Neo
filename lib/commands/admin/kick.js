const logger = require("../../utils/logger");
const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(
            PermissionFlagsBits.KickMembers
        )
        .setDescription("Kicks mentioned member from this server.")
        .addUserOption(option => 
            option
                .setName("target")
                .setDescription("User to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for ban")
        ),
    // slash command parameters
    disabled: true,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        const { client, member, options } = interaction;
        const target = options.getMember("target");
        if (target.user.id === client.user.id) return interaction.reply({
            content: "Safety protocols prevent me from kicking myself.",
            ephemeral: true
        });
        if (target.user.id === member.user.id) return interaction.reply({
            content: "Safety protocols prevent me from kicking yourself.",
            ephemeral: true
        });
        await interaction.reply({
            content: `Are you sure you want to kick ${userMention(target.user.id)}?`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("kick_confirm")
                    .setEmoji("🔨")
                    .setLabel("Confirm")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("kick_cancel")
                )
            ],
            ephemeral: true
        }).then(() => {
            channel.awaitMessageComponent({ errors: ["time"], max: 1, time: 60_000 })
            .then(async (res) => {
                if (res.customId === "kick_confirm") {
                    try {
                        if (member.bannable) {
                            await member.kick({ reason: reason });
                        } else {
                            await interaction.editReply({
                                content: `${member} has been kicked from this server.`,
                                ephemeral: true
                            });
                        };
                    } catch (err) {
                        logger.error(`${err.name}: ${err.message}`);
                        logger.error(`An error occurred while kicking user "${member.displayName}" from "${member.guild.name}"`);
                        await interaction.editReply({
                            content: `Failed to kick ${member} from this server.`,
                            ephemeral: true
                        });
                    };
                }
            });
        }).catch(async () => {
            return interaction.editReply({
                content: "No response received from user. Aborting action.",
                components: [],
                ephemeral: true
            })
        });
    }
}