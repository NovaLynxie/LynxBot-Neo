const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType, ThreadAutoArchiveDuration, ChannelType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const schema = require("../../assets/schemas/support.json");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Support Ticket System")
        .setContexts(InteractionContextType.Guild)
        .addSubcommand(subcommand =>
            subcommand
                .setName("close")
                .setDescription("Close ticket")
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason for closing ticket")
                        .setRequired(false)
                        .setChoices(
                        {
                            name: schema.tickets.states.COMPLETE,
                            value: "COMPLETE",
                        },
                        {
                            name: schema.tickets.states.UNRESOLVED,
                            value: "UNRESOLVED",
                        }
                    )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("lock")
                .setDescription("Locks the ticket thread.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription("List support tickets")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Creates a new support ticket")
                .addStringOption(option =>
                    option
                        .setName("category")
                        .setDescription("What category does your ticket fall under?")
                        .setChoices(
                            {
                                "name": schema.tickets.categories.request.title,
                                "value": "request"
                            },
                            {
                                "name": schema.tickets.categories.support.title,
                                "value": "support"
                            }
                        )
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { client, guild, member, options } = interaction;
        const { Common: { Settings }, Support: { Tickets } } = client.storage.models;
        const serverSettings = await Settings.findOne({ where: { guildId: interaction.guild.id } });
        const subcommand = options.getSubcommand(); // fetch subcommand executed
        const staffChannel = guild.channels.resolve(serverSettings.get("staffChannel"));
        const ticketsChannel = guild.channels.resolve(serverSettings.get("ticketsChannel"));
        if (!ticketsChannel) return interaction.reply({
            content: "No tickets channel has been configured for this server! Please configure it using `/settings`.",
            ephemeral: true
        });
        // TODO - Implement ticket command!
        if (subcommand === "close") {
            if (interaction.channel.isThreadOnly()) {
                // ...
            } else {
                if (member.permissions.has(PermissionFlagsBits.ManageThreads)) {
                    // ...
                } else {
                    // ...
                };
            };
        };
        if (subcommand === "lock") {
            if (interaction.channel.isThreadOnly()) {
                await interaction.channel.setLocked(true);
            } else {
                if (member.permissions.has(PermissionFlagsBits.ManageThreads)) {
                    // ...
                } else {
                    // ...
                };
            };
        };
        if (subcommand === "new") {
            try {
                await interaction.editReply({ content: "Opening ticket..." });
                const ticketRecord = await Tickets.create({
                    authorId: member.user.id
                });
                const ticketThread = await ticketsChannel.threads.create({
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
                    name: `ticket#${ticketRecord.getDataValue("ticketId")}-${member.user.username}`,
                    type: ChannelType.PrivateThread,
                    reason: "Neo Support System: Opened private thread for discussing issue ticket."
                });
                await ticketThread.setInvitable(false, "Enforcing ticket thread permissions.");
                await Tickets.update(
                    {
                        channelId: ticketsChannel.id,
                        threadId: ticketThread.id,
                        ticketTitle: ticketThread.name,
                        category: "CATEGORY_HERE"
                    }
                );
                const ticketEmbed = new EmbedBuilder()
                    .setTitle(`Ticket#${ticketRecord.getDataValue("ticketId")}`);
                await interaction.editReply({
                    content: `Ticket ${ticketThread} created successfully!`
                });
            } catch (err) {
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
                await interaction.editReply({
                    content: "An error occurred while creating your ticket! Please contact an administrator."
                });
            };
        };
    }
};