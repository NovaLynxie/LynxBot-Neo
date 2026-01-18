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
    enabled: true,
    permsLevel: 0,
    restricted: false,
    // slash command functions
    async autocomplete(interaction) {
        // TODO: implement autocomplete for commands usage help?
        const { options, client } = interaction;
        const focusedOption = options.getFocused(true);
        if (focusedOption.name === "command") {
            const choices = client.commands.cache.map(cmd => cmd.data.name);
            const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice }))
            );
        };
    },
    async execute(interaction) {
        const { client, options } = interaction;
        const subcommand = options.getSubcommand();
        const helpEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Bot Application Help Utility 🆘");
        switch (subcommand) {
            case "about":
                helpEmbed
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTitle(`About ${client.user.username} 🤖`)
                    .setDescription("This bot is designed to provide various functionalities and utilities to enhance your Discord server experience. Use the commands subcommands to get more information about available commands and their usage.");
                break;
            case "usage":
                const commandName = options.getString("command");
                const command = client.commands.cache.get(commandName);
                if (!command) {
                    helpEmbed.setDescription(`Command \`${commandName}\` not found.`);
                } else {
                    helpEmbed
                        .setTitle(`Help: \`${command.data.name}\` Command 🛠️`)
                        .setDescription(command.data.description || "No description available.")
                        .addFields(
                            { name: "Cooldown", value: `${command.cooldown || 0} seconds`, inline: true },
                            { name: "Permissions Level", value: `${command.permsLevel || 0}`, inline: true },
                        );
                    if (command.data.options && command.data.options.length > 0) {
                        const optionsDescription = command.data.options.map(option => {
                            return `\`${option.name}\`: ${option.description || "No description"}`;
                        }).join("\n");
                        helpEmbed.addFields({ name: "Options", value: optionsDescription });
                    };
                };
                break;
            case "list":
                helpEmbed.setDescription(stripIndents`
                    Available Commands (${client.commands.cache.size}):
                    ${client.commands.cache.map(cmd => `- ${cmd.data.name}`).join("\n")}
                `);
                break;
            default:
                helpEmbed.setDescription("Please specify a valid subcommand.");
                logger.warn(`Help command invoked with unknown subcommand: ${subcommand}`);
        };
        await interaction.reply({
            embeds: [helpEmbed],
            //flags: MessageFlags.Ephemeral
        });
    }
};