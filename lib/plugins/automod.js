const logger = require("../utils/logger")("automod");
require("@tensorflow/tfjs"); // required to enable tensorflow modules
const toxicity = require("@tensorflow-models/toxicity");

async function scanMessage(message) {
    const client = message.client, guild = message.guild;
    if (!message?.content) return false;
    const { models: { Common: { Settings }} } = client.storage;
    const settings = await Settings.findOne({ where: { guildId: guild.id } });
    const blacklistedKeywords = settings.get("blacklistedKeywords") ?? [];
    const useCapslockSpamFilter = settings.get("useCapslockSpamFilter") ?? false;
    const useMessageContextAnalysis = settings.get("useMessageContextAnalysis") ?? false;
    if (blacklistedKeywords.length >= 1) {
        try {
            let matches = [];
            for (const word of blacklistedKeywords) {
                const result = message.content.match(word.toString().toLowerCase());
                if (result.length >= 1) matches.push({ [word]: result });
            };
        } catch (err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    };
    if (useCapslockSpamFilter == true) {
        try {
            const words = message.content.split(/\s+/);
            const result = words.filter(word => /^[A-Z]/.test(word));
            if ((result.length / words.length) * 100 > 90) {
                logger.warn();
            };
        } catch (err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    };
    if (useMessageContextAnalysis == true) {
        const model = await toxicity.load((message.channel.nsfw) ? 0.9 : 0.5);
        try {
            const predictions = await model.classify(message.content);
            logger.verbose(`${message.channel.name}(${message.channel.id}) -> ${message.author.username}(${message.author.id}): "${message.content}"`);
            for (const prediction of predictions) {
                for (const result of prediction.results) {
                    logger.verbose(`${prediction.label}: ${(result.match) ? "yes" : "no"}`);
                };
            };
        } catch (err) {
            logger.error(`${err.name}: ${err.message}`);
            logger.debug(err.stack);
        };
    };
};

module.exports = { scanMessage };