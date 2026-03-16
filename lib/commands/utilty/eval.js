const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, codeBlock } = require("discord.js");
const logger = require("../../utils/logger")("command");
const util = require("node:util");
const { permissions } = require("../../assets/schemas/common.json");

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Application command line [DEVELOPER ONLY]")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName("code")
                .setDescription("User input to evaluate")
                .setRequired(true)
        ),
    // slash command parameters
    enabled: true,
    permsLevel: permissions.commands.DEVELOPER,
    restricted: true,
    // slash command functions
    async execute(interaction) {
        const { client, user, options } = interaction;
        const { developers } = client.options.config;
        const rawInput = options.getString("code", true);
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const evalEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("EVAL Console 🖥️");
        async function cleanCode(code) {
            if (code && code.constructor.name === "Promise") code = await code;
            if (typeof code !== "string") code = util.inspect(code, { depth: 1 });
            code = code
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
            return code;
        };
        if (!developers.includes(user.id)) {
            return interaction.editReply({
                content: "You do not have permission to use this command!"
            });
        } else {
            let buffer, output, timer = { start: 0, end: 0 };
            try {
                timer.start = performance.now();
                output = eval(await cleanCode(rawInput));
                timer.end = performance.now();
                if (util.inspect(output).length > 4096) {
                    buffer = Buffer.from(util.inspect(output), "utf-8");
                    evalEmbed.setDescription(codeBlock(`EVAL returned an output too large for embed text field. \nPlease see attached "output.txt" for response.`));
                } else {
                    evalEmbed.setDescription(codeBlock(util.inspect(output, false, 3)));
                };
                evalEmbed.addFields(
                    { name: "⚙️ Execution Time", value: codeBlock(`${(timer.end - timer.start).toFixed(2)} ms`) }
                )
            } catch (err) {
                logger.error(`Error occurred while processing raw input from ${user.username}:${user.id}`);
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
                evalEmbed.setDescription(codeBlock(`${err.name}: ${err.message}\n ${err.stack}`));
            };
            await interaction.editReply({ embeds: [evalEmbed] });
            if (buffer) {
                const evalFile = new AttachmentBuilder(buffer, { name: "result.txt", description: "LynxBot (Neo) EVAL Result" });
                await interaction.followUp({ flags: MessageFlags.Ephemeral, files: [evalFile] });
            }
        };
    }
};