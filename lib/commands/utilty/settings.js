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
        /*
        .addSubcommandGroup(subcmdgroup =>
            subcmdgroup
                .setName("database")
                .setDescription("Database Settings")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("list")
                        .setDescription("Lists all active databases.")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("reset")
                        .setDescription("Reset application database?")
                        .addStringOption(option =>
                            option
                                .setName("table_name")
                                .setDescription("Resets only this database table")
                                .setAutocomplete(true)
                        )
                )
        )
        */
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
                                .setRequired(true)
                        )
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async autocomplete(interaction) {
        const { client, options } = interaction;
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
        /*
        if (subcmdgroup === "database") {
            const tables = [];
            for (const category of Object.keys(client.storage.models)) {
                if (Object.keys(client.storage.models[category]).length <= 0) continue;
                for (const model of Object.keys(client.storage.models[category])) {
                    console.log({ name: `${category}.${model}`, value: model });
                    tables.push({ name: `${category}.${model}`, value: model });
                };
            };
            await interaction.respond(tables);
        };
        */
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
                .setTitle("Settings")
        };
        function updateSetting(key, value) {
            Settings.update(
                { [key]: value },
                { where: { guildId: guild.id } }
            );
        };
        switch (subcmdgroup) {
            case "channels":
                if (subcommand === "set") {
                    try {
                        updateSetting(settingKey, targetChannel.id);
                        return interaction.editReply({
                            content: `Updated "${settingKey}" to ${targetChannel}!`
                        });
                    } catch (err) {
                        logger.error(`${err.name}: ${err.message}`);
                        logger.debug(err.stack);
                        return interaction.editReply({
                            content: `An error occurred while updating "${settingKey}"!`
                        });
                    };
                };
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
            case "database":
                const regexp = RegExp(options.getString("table_name"), "gm");
                break;
            case "roles":
                if (subcommand === "set") {
                    try {
                        updateSetting(settingKey, selectedRole.id);
                        return interaction.editReply({
                            content: `Updated "${settingKey}" to ${selectedRole}!`
                        });
                    } catch (err) {
                        logger.error(`${err.name}: ${err.message}`);
                        logger.debug(err.stack);
                        return interaction.editReply({
                            content: `An error occurred while updating "${settingKey}"!`
                        });
                    };
                };
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