const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType, ThreadAutoArchiveDuration, ChannelType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
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
                            name: schema.tickets.states.DONE,
                            value: "DONE",
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
                        .setRequired(true)
                        .setChoices(
                            {
                                "name": schema.tickets.categories.request.title,
                                "value": "REQUEST"
                            },
                            {
                                "name": schema.tickets.categories.support.title,
                                "value": "SUPPORT"
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
        const ticketsModRole = guild.roles.resolve(serverSettings.get("ticketsModRole") ?? serverSettings.get("staffDefaultRole"));
        const staffChannel = guild.channels.resolve(serverSettings.get("staffChannel"));
        const ticketsChannel = guild.channels.resolve(serverSettings.get("ticketsChannel"));
        let ticketData; // reserved variables for ticket command
        if (!ticketsChannel) return interaction.editReply({
            content: "No tickets channel has been configured for this server! Please configure it using `/settings`."
        });
        async function updateTicketData(thread, reason = options.getString("reason")) {
            try {
                await Tickets.update({
                        ticketState: schema.tickets.states[reason] ?? "UNKNOWN"
                    },
                    { where: { threadId: thread.id } }
                );
            } catch (err) {
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
            };
        };
        async function transcribeTicket(thread) {
            let threadTranscript;
            try {
                threadTranscript = await createTranscript(thread);
            } catch (err) {
                logger.error("Failed to create transcript from ticket thread!");
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
            };
            const ticketOwner = client.users.resolve(ticketData.get("authorId"));
            try {
                await ticketOwner.send({
                    content: "Here is your ticket transcript.",
                    files: [threadTranscript]
                });
            } catch (err) {
                logger.warn(`Failed to send ticket history to ${ticketOwner.username}! Maybe user has disabled their DMs for ${guild.name}?`);
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
            };
        };
        if (subcommand === "close") {
            if (interaction.channel.isThread()) {
                const ticketThread = ticketsChannel.threads.resolve(interaction.channel);
                ticketData = await Tickets.findOne({
                    where: { authorId: member.user.id, threadId: ticketThread.id }
                });
                if (member.user.id === ticketData.get("authorId") || (member.permissions.has(PermissionFlagsBits.ManageThreads) && member.roles.cache.has(ticketsModRole.id))) {
                    await interaction.editReply({
                        content: "Closing ticket!"
                    });
                    try {
                        await transcribeTicket(ticketThread);
                        await updateTicketData(ticketThread);
                        setTimeout(async () => await ticketThread.delete(), 10000);
                    } catch (err) {
                        logger.error(`${err.name}: ${err.message}`);
                        logger.debug(err.stack);
                    };
                } else {
                    return interaction.editReply({
                        content: "You do not have permission to close this ticket! Only a moderator or ticket owner can close this thread."
                    });
                };
            } else {
                return interaction.editReply({
                    content: "This command only works in ticket threads! Please go to your ticket and run the command again."
                });
            };
        };
        if (subcommand === "lock" || subcommand === "unlock") {
            if (interaction.channel.isThread()) {
                if (member.permissions.has(PermissionFlagsBits.ManageThreads) && member.roles.cache.has(ticketsModRole.id)) {
                    if (subcommand === "lock") {
                        await updateTicketData(interaction.channel, schema.tickets.states.LOCKED);
                        await interaction.channel.setLocked(true);
                    };
                    if (subcommand === "unlock") {
                        await updateTicketData(interaction.channel, schema.tickets.states.OPEN);
                        await interaction.channel.setLocked(false);
                    };
                } else {
                    return interaction.editReply({
                        content: "You do not have permission to close this ticket! Only a moderator or ticket owner can close this thread."
                    });
                };
            } else {
                return interaction.editReply({
                    content: "This command only works in ticket threads! Please go to your ticket and run the command again."
                });
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
                        category: options.getString("category")
                    },
                    { where: { ticketId: ticketRecord.get("ticketId") } }
                );
                const ticketEmbed = new EmbedBuilder()
                    .setTitle(`Ticket#${ticketRecord.getDataValue("ticketId")}`);
                await interaction.editReply({
                    content: `Ticket ${ticketThread} created successfully!`
                });
                await ticketThread.send({
                    content: `Ticket created for ${member}. Adding ${ticketsModRole}`,
                    embeds: [ticketEmbed]
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