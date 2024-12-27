const logger = require("../utils/logger")("events");
const { Events } = require("discord.js");

module.exports = {
    name: Events.Debug,
    async execute(data) {
        logger.verbose(data);
    }
};