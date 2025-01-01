const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType, ChannelType } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("settings")
        .setContexts(InteractionContextType.Guild)
        .setDescription("Server Configuration")
        .addSubcommandGroup(subcmdgroup =>
            subcmdgroup
                .setName("channels")
                .setDescription("Channel Settings")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription("Displays server's channel configuration")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("set")
                        .setDescription("Update channel setting")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("name")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("channel")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async autocomplete(interaction) {
        const { client, guild, options } = interaction;
        const { Common: { Settings } } = client.storage.models;
        const focusedOption = options.getFocused(true);
        if (subcommand === "channels") {};
        if (subcommand === "") {};
        switch (focusedOption.name) {
            case "channels":
                break;
            default:
                // ...
        };
        const settings = await Settings.findOne({ where: { guildId: guild.id } });
        console.log(settings);
        await interaction.respond([{ name: "WORK IN PROGRESS", value: "WIP" }]);
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { client, guild } = interaction;
        const { Common: { Settings } } = client.storage.models;
        const settings = await Settings.findOne({ where: { guildId: guild.id } });
        //switch () {};
        await interaction.editReply({
            content: "WORK IN PROGRESS!"
        });
    }
};