const logger = require("../../utils/logger")("command");
const https = require("node:https");
const schema = require("../../assets/schemas/music.json");
const { getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require("@discordjs/voice");
const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require("discord.js");
const { parseStream } = require("music-metadata");

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
                .setName("skip")
                .setDescription("Skips current song")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stops music player")
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
                    resource = null;
                    if (stopped) return;
                    await loadSong(true);
                });
            };
            if (checkEventListeners(audioPlayer, "stateChange")) {
                audioPlayer.on("stateChange", (oldState, newState) => {
                    logger.debug(`AudioPlayer => ${oldState.status} -> ${newState.status}`);
                });
            };
            if (checkEventListeners(audioPlayer, "error")) {
                audioPlayer.on("error", (err) => {
                    logger.error("An error occurred while playing audio!");
                    logger.error(`${err.name}: ${err.message}`);
                    logger.debug(err.stack);
                });
            };
        };
        if (connection) {
            if (checkEventListeners(connection, VoiceConnectionStatus.Ready)) {
                connection.on(VoiceConnectionStatus.Ready, () => {
                    logger.debug(`VoiceConnection => Connected to voice channel successfully!`);
                });
            }
            if (checkEventListeners(connection, "debug")) {
                connection.on("debug", (message) => logger.debug(message));
            };
            if (checkEventListeners(connection, "error")) {
                connection.on("error", (err) => {
                    connection.destroy(); // destroy errored connection assuming it not recoverable
                    logger.error(`${err.name}: ${err.message}`);
                    logger.debug(err.stack);
                });
            };
            if (checkEventListeners(connection, "stateChange")) {
                connection.on("stateChange", (oldState, newState) => {
                    logger.debug(`VoiceConnection => State changed ${oldState.status} -> ${newState.status}`);
                });
            };
        };
        async function fetchFileData(url) {
            return new Promise((resolve, reject) => {
                https.get(url, (response) => {
                    switch (response.statusCode) {
                        case 200:
                            resolve(response);
                            break;
                        case 302:
                            resolve(response.headers.location);
                            break;
                        default:
                            reject(new Error(`Unexpected HTTP Code: ${response.statusCode}`));
                    };
                })
            });
        };
        async function addSong(data) {
            try {
                const song = await Music.create({
                    guildId: member.guild.id ?? guild.id,
                    memberId: member.user.id,
                    title: data.title,
                    //duration: data.duration,
                    source: data.source ?? "UNKNOWN",
                    url: data.url
                });
                if (client.music.resources.get(member.guild.id ?? guild.id)) {
                    await interaction.editReply({
                        content: `📜 Added song to the music queue!`
                    });
                };
                return song;
            } catch (err) {
                logger.error(`${err.name}: ${err.message}`);
                logger.debug(err.stack);
                await interaction.editReply({
                    content: `⚠️ Failed to add song to the music queue!`
                });
                return null;
            };
        };
        async function loadSong(bump = false) {
            voiceChannel = guild.channels.resolve(connection?.joinConfig.channelId);
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
                    if (voiceChannel) return voiceChannel.send({
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
                resource = null;
                client.music.resources.delete(member.guild.id ?? guild.id);
                return interaction.followUp({
                    content: "No more songs to play!", ephemeral: true
                });
            } else {
                const defaultVolume = serverSettings.get("globalVoiceVolume") ?? 50;
                if (nextSong.get("source") == schema.types.FILE) {
                    let file = {
                        data: await fetchFileData(nextSong.get("url")),
                        url: nextSong.get("url")
                    };
                    console.log(file);
                    resource = createAudioResource(file.url, {
                        inlineVolume: true,
                        metadata: await parseStream(file.data)
                    });
                } else {
                    resource = createAudioResource(nextSong.get("url"), {
                        inlineVolume: true
                    });
                };
                resource = createAudioResource(nextSong.get("url"), { inlineVolume: true });
                resource.volume.setVolume(defaultVolume / 100);
                audioPlayer.play(resource);
                client.music.resources.set(guild.id, resource);
            };
        };
        switch (subcmdgrp ?? subcommand) {
            case "play":
                let data = { title: "", url: "" };
                let song;
                if (subcommand === "file") {
                    await interaction.editReply({
                        content: "Loading file..."
                    });
                    const attachment = options.getAttachment("file");
                    const fileStream = await fetchFileData(attachment.url);
                    const metadata = await parseStream(fileStream);
                    resource = createAudioResource(attachment.url, { metadata: metadata, inlineVolume: true });
                    data.title = attachment.title ?? attachment.name;
                    data.url = attachment.url;
                    data.metadata = metadata;
                    data.source = schema.types.FILE;
                    song = await addSong(data);
                };
                if (subcommand === "link") {
                    await interaction.editReply({
                        content: "Loading URL..."
                    });
                    resource = createAudioResource(options.getString("url"), { inlineVolume: true });
                    data.url = options.getString("url");
                    data.source = schema.types.GENERIC;
                    song = await addSong(data);
                };
                if (!member.voice) {
                    return interaction.editReply({
                        content: "You are not in a voice channel!"
                    });
                };
                /*
                try {
                    const song = await Music.create({
                        guildId: member.guild.id ?? guild.id,
                        memberId: member.user.id,
                        title: data.title,
                        //duration: duration,
                        url: data.url,
                        //source: source
                    });
                    if (client.music.resources.get(member.guild.id ?? guild.id)) {
                        return interaction.editReply({
                            content: `📜 Added song to the music queue!`
                        });
                    };
                } catch (err) {
                    logger.error(`${err.name}: ${err.message}`);
                    logger.debug(err.stack);
                    return interaction.editReply({
                        content: `⚠️ Failed to add song to the music queue!`
                    });
                };
                */
                if (song.get("id") > 1) return; // if song added to queue, return here
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
            case "skip":
                await loadSong(true);
                return interaction.followUp({
                    content: "Skipped song!",
                    ephemeral: true
                });
            case "stop":
                stopped = true;
                await audioPlayer.stop();
                await interaction.editReply({
                    content: "Stopped player!"
                });
                break;
            case "queue":
                const queueEmbed = new EmbedBuilder()
                    .setTitle("Music Queue")
                    .setDescription(`COMING SOON!`);
                return interaction.editReply({
                    embeds: [queueEmbed]
                });
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