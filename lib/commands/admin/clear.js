const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setContexts(InteractionContextType.Guild)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDescription("Message Cleaner")
        .addIntegerOption(option =>
            option
                .setName("messages")
                .setDescription("Number of messages to sweep from channel")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to target")
                .addChannelTypes(ChannelType.GuildText)
        )
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("Filter messages by user")
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        const { client, member, options } = interaction;
        const channel = options.getChannel("channel") ?? interaction.channel;
        const target = options.getMember("target");
        const msgsLimit = options.getInteger("messages", true);
        await interaction.deferReply({ ephemeral: true });
        if (!channel.viewable) {
            return interaction.editReply({
                content: `Unable to remove messages from ${channel}.`
            });
        } else {
            try {
                const fetchedMessages = await channel.messages.fetch({ limit: msgsLimit });
                if (target) {
                    const filteredMessages = fetchedMessages.filter(message => message.author.id === target.user.id);
                    await channel.bulkDelete(filteredMessages, true);
                    return interaction.editReply({
                        content: `Successfully deleted ${msgsLimit} messages from ${target} in ${channel}.`
                    });
                } else {
                    await channel.bulkDelete(fetchedMessages, true);
                    return interaction.editReply({
                        content: `Successfully deleted ${msgsLimit} messages from ${channel}.`
                    });
                };
            } catch (err) {
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
                await interaction.editReply({
                    content: `Failed to delete messages from ${channel}! ${err.message}`
                });
            };
        };
    }
};