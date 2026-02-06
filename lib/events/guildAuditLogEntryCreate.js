const logger = require("../utils/logger")("events");
const { Events } = require("discord.js");
const { createAuditEventLog } = require("../plugins/guildlogs");

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog, guild) {
        const client = guild.client;
        const { action, extra: channel, executorId, targetId } = auditLog;
        const executor = await client.users.fetch(executorId);
        const target = await client.users.fetch(targetId);
        try {
            await createAuditEventLog(action, guild, channel, executor, target);
        } catch(err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    }
};