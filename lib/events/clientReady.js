const logger = require("../utils/logger")("events");
const dashboard = require('../dashboard/server');
const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        logger.info(`Logged in as "${client.user.tag}"`);
        if (process.env.NODE_ENV !== "production") await client.storage.sync(process.env?.DB_UPDATE === "true", process.env?.DB_RESET === "true");
        const { Users } = client.storage.models.Common;
        client.guilds.cache.each((guild) => {
            setTimeout(async () => await client.storage.init("guild", { guild }), 1000);
        });
        client.users.cache.each((user) => {
            setTimeout(async () => await Users.findOrCreate({ where: { userId: user.id } }), 1000);
        });
        try {
            dashboard.run(client, { host: "localhost", port: 3000 });
        } catch (error) {
            logger.warn("Failed to start dashboard service! Check logs for error reason.");
            logger.error(`${error.name}: ${error.message}`);
            logger.debug(error.stack);
        };
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
        logger.info("LynxBot is now READY");
    }
};