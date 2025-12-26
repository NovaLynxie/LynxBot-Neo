const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Bot Application Help")
        .addSubcommand(subcommand =>
            subcommand
                .setName("about")
                .setDescription("Show information about the bot.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("commands")
                .setDescription("List all available commands.")
        ),
    // slash command parameters
    disabled: true,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async execute(interaction) {
        const { options } = interaction;
        const subcommand = options.getSubcommand();
        switch (subcommand) {
            case "":
                break;
            default:
                // do nothing :3
        }
        await interaction.reply({
            content: "HELP_COMMAND_PLACEHOLDER",
            flags: MessageFlags.Ephemeral
        });
    }
}