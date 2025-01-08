const logger = require("../../utils/logger")("command");
const { getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder, InteractionContextType, Collection } = require("discord.js");

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music Player")
        .setContexts(InteractionContextType.Guild)
        .addSubcommandGroup(subcmdgrp => 
            subcmdgrp
                .setName("play")
                .setDescription("Play song!")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("file")
                        .setDescription("Upload audio file")
                        .addAttachmentOption(option =>
                            option
                                .setName("file")
                                .setDescription("Audio file (mp3, wav, etc.)")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("link")
                        .setDescription("Stream from URL")
                        .addStringOption(option =>
                            option
                                .setName("url")
                                .setDescription("Audio stream")
                                .setRequired(true)
                        )
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("pause")
                .setDescription("Pauses music")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("queue")
                .setDescription("Displays server's music queue")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Volume controls")
                .addIntegerOption(option =>
                    option
                        .setName("value")
                        .setDescription("Set audio volume (range: 1-100)")
                        .setMaxValue(100)
                        .setMinValue(1)
                )
                .addBooleanOption(option =>
                    option
                        .setName("default")
                        .setDescription("Set as default server volume?")
                )
        ),
    // slash command parameters
    disabled: false,
    permsLevel: 0,
    restricted: false,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const { client, guild, member, options } = interaction;
        const { Common: { Settings }, Voice: { Music } } = client.storage.models;
        const subcmdgrp = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();
        const serverSettings = await Settings.findOne({ where: { guildId: guild.id } });
        let connection = getVoiceConnection(member.voice?.channel.guild.id ?? guild.id);
        let resource = client.music.resources.get(member.guild.id ?? guild.id);
        let stopped = false;
        let voiceChannel = member.voice?.channel ?? guild.channels.resolve(connection.joinConfig.channelId);
        const audioPlayer = connection?.state?.subscription?.player ?? createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause }, debug: false });
        const checkEventListeners = (emitter, listener) => emitter.listenerCount(listener) < 1;
        if (audioPlayer) {
            //audioPlayer.once("debug", (message) => logger.debug(message));
            if (checkEventListeners(audioPlayer, AudioPlayerStatus.Idle)) {
                audioPlayer.on(AudioPlayerStatus.Idle, async () => {
                    client.music.resources.delete(guild.id);
                    if (stopped) return;
                    await loadSong(true);
                });
            }
            if (checkEventListeners(audioPlayer, "stateChange")) {
                audioPlayer.on("stateChange", (oldState, newState) => {
                    logger.debug(`AudioPlayer => ${oldState.status} -> ${newState.status}`);
                });
            }
            if (checkEventListeners(audioPlayer, "error")) {
                audioPlayer.on("error", (err) => {
                    logger.error(`AudioPlayer Error: ${err.message}`);
                    logger.debug(err.stack);
                });
            }
        }
        if (connection) {
            if (checkEventListeners(connection, "error")) {
                connection.on("error", (err) => {
                    connection.destroy();
                    logger.error(err.message);
                });
            }
            if (checkEventListeners(connection, "stateChange")) {
                connection.on("stateChange", (oldState, newState) => {
                    logger.debug(`VoiceConnection => ${oldState.status} -> ${newState.status}`);
                });
            }
        }
        async function loadSong(bump = false) {
            voiceChannel = guild.channels.resolve(connection.joinConfig.channelId);
            if (bump) {
                const playedSong = await Music.findOne({
                    where: { guildId: member.guild.id ?? guild.id }
                });
                if (playedSong) {
                    await Music.destroy({
                        where: {
                            id: playedSong.get("id"),
                            guildId: member.guild.id ?? guild.id,
                            memberId: member.user.id, 
                        }
                    });
                } else {
                    return voiceChannel.send({
                        content: "Music queue is empty!"
                    });
                };
            };
            const nextSong = await Music.findOne({
                where: {
                    guildId: member.guild.id ?? guild.id,
                }
            });
            if (!nextSong) {
                return interaction.followUp({
                    content: "No more songs to play!", ephemeral: true
                });
            } else {
                const defaultVolume = serverSettings.get("globalVoiceVolume") ?? 50;
                resource = createAudioResource(nextSong.get("url"), { inlineVolume: true });
                resource.volume.setVolume(defaultVolume / 100);
                client.music.resources.set(guild.id, resource);
            };
        };
        switch (subcmdgrp ?? subcommand) {
            case "play":
                let data = { title: "", url: "" };
                if (!resource || resource.ended) {
                    if (subcommand === "file") {
                        await interaction.editReply({
                            content: "Loading file..."
                        });
                        const attachment = options.getAttachment("file");
                        resource = createAudioResource(attachment.url, { inlineVolume: true });
                        client.music.resources.set(guild.id, resource);
                        data.title = attachment.title ?? attachment.name;
                        data.url = attachment.url;
                    };
                    if (subcommand === "link") {
                        await interaction.editReply({
                            content: "Loading URL..."
                        });
                        resource = createAudioResource(options.getString("url"), { inlineVolume: true });
                        data.url = options.getString("url");
                    };
                    if (!member.voice) {
                        return interaction.editReply({
                            content: "You are not in a voice channel!"
                        });
                    };
                };
                try {
                    const song = await Music.create({
                        guildId: member.guild.id ?? guild.id,
                        memberId: member.user.id,
                        title: data.title,
                        //duration: duration,
                        url: data.url,
                        //source: source
                    });
                    if (!resource.ended && resource.started) {  
                        return interaction.editReply({
                            content: `📜 Added "${data.title} to the music queue!`
                        });
                    };
                } catch (err) {
                    logger.error(`${err.name}: ${err.message}`);
                    logger.debug(err.stack);
                    return interaction.editReply({
                        content: `⚠️ Failed to add "${data.title}" to the music queue!`
                    });
                };
                if (!connection) {
                    connection = joinVoiceChannel({
                        adapterCreator: member.voice?.channel.guild.voiceAdapterCreator,
                        channelId: member.voice.channel.id,
                        guildId: member.voice?.channel.guild.id ?? member.guild.id ?? guild.id
                    });
                };
                const defaultVolume = serverSettings.get("globalVoiceVolume") ?? 50;
                resource?.volume.setVolume(defaultVolume / 100);
                connection.subscribe(audioPlayer);
                audioPlayer.play(resource);
                client.music.resources.set(guild.id, resource);
                stopped = false;
                await interaction.editReply({
                    content: "Playing song!"
                });
                break;
            case "pause":
                await audioPlayer.pause();
                await interaction.editReply({
                    content: "Paused player!"
                });
                break;
            case "stop":
                await audioPlayer.stop();
                stopped = true;
                await interaction.editReply({
                    content: "Stopped player!"
                });
                break;
            case "volume":
                const volume = options.getInteger("value");
                if (volume) {
                    if (options.get("default")) Settings.update(
                        {
                            "globalVoiceVolume": volume
                        },
                        {
                            where: { guildId : member.guild.id ?? guild.id }
                        }
                    );
                    resource.volume.setVolume(volume / 100);
                    await interaction.editReply({
                        content: `Set volume to ${volume}%`
                    });
                } else {
                    await interaction.editReply({
                        content: `Volume: ${Math.floor(resource.volume.volumeLogarithmic * 100).toFixed(0)}%`
                    });
                };
                break;
            default:
                logger.warn(`Unknown or invalid "music" subcommand "${subcommand}" called by user!`)
                await interaction.editReply({
                    content: "Invalid music subcommand!"
                });
        };
    }
};