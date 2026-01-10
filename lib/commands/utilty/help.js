const logger = require("../../utils/logger")("command");
const { stripIndents } = require("common-tags");
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Bot Application Help Utility")
        .addSubcommand(subcommand =>
            subcommand
                .setName("about")
                .setDescription("General help information about the bot.")
        )
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup
                .setName("commands")
                .setDescription("Commands related help.")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("usage")
                        .setDescription("Give usage help for specific command")
                        .addStringOption(option =>
                            option
                                .setName("command")
                                .setDescription("The command to get help for.")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription("List all available commands.")
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async autocomplete(interaction) {

    },
    async execute(interaction) {
        const { client, options } = interaction;
        const subcommand = options.getSubcommand();
        const helpEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Bot Application Help Utility 🆘");
        switch (subcommand) {
            case "about":
                helpEmbed.setDescription("This bot is designed to provide various functionalities and utilities to enhance your Discord server experience. Use the commands subcommands to get more information about available commands and their usage.");
                break;
            case "usage":
                break;
            case "list":
                helpEmbed.setDescription(stripIndents`
                    Available Commands (${client.commands.cache.size}):
                    ${client.commands.cache.map(cmd => `- ${cmd.data.name}`).join("\n")}
                `);
                break;
            default:
                helpEmbed.setDescription("Please specify a valid subcommand.");
        };
        await interaction.reply({
            embeds: [helpEmbed],
            //flags: MessageFlags.Ephemeral
        });
    }
};