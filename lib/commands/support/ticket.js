const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Support Ticket System")
        .setContexts(InteractionContextType.Guild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Creates a new support ticket")
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        const { client, member } = interaction;
        const { Common: { Settings } } = client.storage.models;
        const ticketsChannel = client.channels.resolve(await Settings.findOne({ where: { guildId: interaction.guild.id } }));
        if (!ticketsChannel) return interaction.reply({
            content: "No tickets channel has been configured for this server! Please configure it using `/settings`.",
            ephemeral: true
        });
        // TODO - Implement ticket command!
        await interaction.reply({
            content: "To be implemented!",
            ephemeral: true
        });
    }
};