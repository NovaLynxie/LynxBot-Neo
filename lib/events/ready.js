const logger = require("../utils/logger")("events");
const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as "${client.user.tag}"`);
        await client.user.setPresence({
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "custom_status.booting",
                    state: "Waking up..."
                }
            ]
        });
        await client.storage.sync(process.env?.DB_UPDATE === "true", process.env?.DB_RESET === "true");
        await client.user.setPresence({
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "custom_status.ready",
                    state: "Ready to assist!"
                }
            ],
            status: "online"
        });
    }
}