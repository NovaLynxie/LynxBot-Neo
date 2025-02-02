const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType, ChannelType, EmbedBuilder, codeBlock } = require("discord.js");

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
                        .setDescription("Displays configured server channels")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("set")
                        .setDescription("Configure channels settings")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("Channel setting name")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("Which channel to use?")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup(subcmdgroup =>
            subcmdgroup
                .setName("roles")
                .setDescription("Role Settings")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription("Display configured server roles")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("set")
                        .setDescription("Configure roles settings")
                        .addStringOption(option =>
                            option
                                .setName("key")
                                .setDescription("Role setting name")
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription("Which role to use?")
                        )
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async autocomplete(interaction) {
        const { options } = interaction;
        const subcmdgroup = options.getSubcommandGroup(true);
        if (subcmdgroup === "channels") {
            await interaction.respond([
                { name: "Announcer", value: "announcerChannel" },
                { name: "Bot Logs", value: "defaultChannel" },
                { name: "Moderation", value: "moderationChannel" },
                { name: "Reports", value: "reportsChannel" },
                { name: "Tickets", value: "ticketsChannel" }
            ]);
        };
        if (subcmdgroup === "roles") {
            await interaction.respond([
                { name: "Staff (Default)", value: "staffDefaultRole" },
                { name: "Reports Moderator", value: "reportsModRole" },
                { name: "Tickets Moderator", value: "ticketsModRole" }
            ]);
        };
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { client, guild, options } = interaction;
        const subcmdgroup = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();
        const settingKey = options.getString("key");
        const targetChannel = options.getChannel("channel");
        const selectedRole = options.getRole("role");
        const { Common: { Settings } } = client.storage.models;
        const settings = await Settings.findOne({ where: { guildId: guild.id } });
        function listSettings() {
            const settingsEmbed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle
        };
        function updateSetting(key, value) {
            Settings.update(
                { [key]: value },
                { where: { guildId: guild.id } }
            );
        };
        switch (subcmdgroup) {
            case "channels":
                if (subcommand === "set") updateSetting(settingKey, targetChannel.id);
                if (subcommand === "list") {
                    const guildChannels = await Settings.findOne({
                        where: { guildId: guild.id }
                    });
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Settings > Channels")
                                .setDescription(`
                                    Main Logs:  ${guild.channels.resolve(guildChannels.defaultChannel) ?? "Not set!"}
                                    Announcer:  ${guild.channels.resolve(guildChannels.announcerChannel) ?? "Not set!"}
                                    Moderation: ${guild.channels.resolve(guildChannels.moderationChannel) ?? "Not set!"}
                                `)
                        ]
                    });
                };
                break;
            case "roles":
                if (subcommand === "set") updateSetting(settingKey, selectedRole.id);
                if (subcommand === "list") {
                    const guildRoles = Settings.findOne({
                        fields: ["announcerChannel", "defaultChannel", "moderationChannel", "staffChannel"],
                        where: { guildId: guild.id }
                    });
                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Settings > Roles")
                                .setDescription(`
                                    Staff: ${guild.roles.resolve(guildRoles.staffDefaultRole) ?? "Not set!"}
                                    Reports: ${guild.roles.resolve(guildRoles.reportsModRole) ?? "Not set!"}
                                    Tickets: ${guild.roles.resolve(guildRoles.ticketsModRole) ?? "Not set!"}
                                `)
                        ]
                    });
                };
                break;
            default:
                await interaction.editReply({
                    content: "WORK IN PROGRESS!"
                });
        };
    }
};