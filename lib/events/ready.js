const logger = require("../utils/logger")("events");
const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as "${client.user.tag}"`);
        if (process.env.NODE_ENV !== "production") await client.storage.sync(process.env?.DB_UPDATE === "true", process.env?.DB_RESET === "true");
        let index = 0; // counter for each guild passed
        client.guilds.cache.each((guild) => {
            index++; // increment value for each guild passed
            setTimeout(async () => await client.storage.init("guild", { guild }));
        });
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