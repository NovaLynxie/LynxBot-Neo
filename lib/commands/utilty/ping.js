const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require("discord.js");
const { stripindents } = require("common-tags");

module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bot's latency and responsiveness."),
    // slash command parameters
    enabled: true,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async execute(interaction) {
        const { client } = interaction;
        const pingEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Pinging... 🏓");
        try {
            const sent = await interaction.reply({
                content: "Pinging...",
                fetchReply: true,
                flags: MessageFlags.Ephemeral
            });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);
            pingEmbed.setTitle("Pong! 🏓")
                .setDescription(stripindents`
                    🤖 **App Latency:** ${latency} ms
                    📡 **API Latency:** ${apiLatency} ms
                `)
                .setColor("Green");
            await interaction.editReply({ content: "", embeds: [pingEmbed] });
        } catch (error) {
            logger.error("Error executing ping command:", error);
            logger.debug(error.stack);
            pingEmbed
                .setTitle("Error 🛑")
                .setDescription("An error occurred while trying to ping the bot.")
                .setColor("Red");
            await interaction.editReply({ embeds: [pingEmbed] });
        }
    }
};