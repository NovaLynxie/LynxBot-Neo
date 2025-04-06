const logger = require("../utils/logger")("interaction");
const { Events } = require("discord.js");

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        // ...
    }
}