const logger = require("../../utils/logger")("command");
const { SlashCommandBuilder, PermissionFlagsBits, bold } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload bot commands!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Select the command to reload")
                .setAutocomplete(true)
                .setRequired(true)
        ),
    // slash command parameters
    disabled: false, // whether to disable command internally
    permsLevel: 2, // ignored if restricted is false
    restricted: true, // whether command is restricted
    async autocomplete(interaction) {
        const { client, options } = interaction;
        const focusedValue = options.getFocused();
        const filteredCmds = client.commands.cache.filter((command) => command.data.name.startsWith(focusedValue));
        await interaction.respond(
            filteredCmds.map((command) => ({
                name: command.data.name,
                value: command.data.name,
            }))
        );
    },
    async execute(interaction) {
        const { client, options } = interaction;
        const cmdName = options.getString("command", true).toLowerCase();
        const command = client.commands.cache.get(cmdName);
        if (command) {
            delete require.cache[require.resolve(command.path)];
            try {
                client.commands.cache.delete(command.data.name);
                const fetchedCmd = require(command.path);
                fetchedCmd.path = command.path; // set same path as old command
                client.commands.cache.set(fetchedCmd.data.name, fetchedCmd);
                await interaction.reply({
                    content: `Reloaded command ${bold(cmdName)} successfully!`,
                    ephemeral: true,
                });
            } catch (err) {
                logger.error(err);
                await interaction.reply({
                    content: `Error occured while reloading command ${bold(cmdName)}!`,
                    ephemeral: true,
                });
            }
        } else {
            await interaction.reply({
                content: `I'm sorry but I don't know the command ${bold(cmdName)}.`,
                ephemeral: true,
            });
        }
    },
};
