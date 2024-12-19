const logger = require("../utils/logger")("events");
const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as "${client.user.tag}"`);
        client.user.setPresence({
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "custom.status",
                    state: "Ready to assist!"
                }
            ],
            status: "online"
        });
    }
}