const logger = require("../utils/logger")("events");
const { AuditLogEvent, Events } = require("discord.js");

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    async execute(auditLog, guild) {
        const client = guild.client;
        const { action, extra: channel, executorId, targetId } = auditLog;
        const executor = await client.users.fetch(executorId);
        const target = await client.users.fetch(targetId);
        switch (action) {
            // TODO: Add Audit Log Events to be tracked.
        };
    }
};