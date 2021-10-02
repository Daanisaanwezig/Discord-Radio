"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const { join } = require("path");
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Start playing music!')
        .addStringOption(option => option
        .setName('station')
        .setDescription('Choose the radio station')
        .setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const station = interaction.options.getString('station').toLowerCase();
            if (!fs.existsSync(`../music/${station}`)) {
                return yield interaction.reply('I could not find that radio station, are you sure it exists?');
            }
            fs.readdirSync(`../music/${station}`, (err, files) => __awaiter(this, void 0, void 0, function* () {
                if (!files) {
                    return yield interaction.reply('I could not find that radio station, are you sure it exists?');
                }
            }));
            const voiceChannel = interaction.member.voice;
            if (!voiceChannel.channelId) {
                return yield interaction.reply('Please make sure to join a channel before running this command.');
            }
            const connection = getVoiceConnection(voiceChannel.guild.id);
            if (connection) {
                if (connection.joinConfig.channelId == voiceChannel.channelId) {
                    return yield interaction.reply('I am already playing music in your channel.');
                }
                else {
                    return yield interaction.reply('I am already playing music somewhere else.');
                }
            }
            const voiceConnection = yield joinVoiceChannel({
                channelId: voiceChannel.channelId,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });
            const player = yield createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause
                }
            });
            voiceConnection.subscribe(player);
            yield interaction.reply(`Started playing music in <#${voiceChannel.channelId}>`);
            initPlayer();
            function initPlayer() {
                getTracks(station).then((tracklist) => __awaiter(this, void 0, void 0, function* () {
                    if (tracklist.length == 0) {
                        return yield interaction.reply('There is no music to play, please make sure the music folder contains `mp3` files.');
                    }
                    let trackPath = tracklist.shift();
                    playTrack(client, player, station, trackPath);
                    player.on(AudioPlayerStatus.Idle, () => __awaiter(this, void 0, void 0, function* () {
                        if (tracklist.length == 0) {
                            return initPlayer();
                        }
                        trackPath = tracklist.shift();
                        playTrack(client, player, station, trackPath);
                    }));
                    player.on('error', error => {
                        console.error('Error:', error.message);
                    });
                }));
            }
        });
    }
};
function getTracks(station) {
    const promise = new Promise((resolve, reject) => {
        let tracklist = [];
        fs.readdir(`../music/${station}`, (err, files) => {
            if (err)
                console.log(err);
            let tracks = files.filter(f => f.split('.').pop() === 'mp3');
            tracks.forEach(track => {
                tracklist.push(track);
                if (track == tracks[tracks.length - 1]) {
                    resolve(tracklist.sort(() => (Math.random() > .5) ? 1 : -1));
                }
            });
        });
    });
    return promise;
}
function playTrack(client, player, trackStation, trackPath) {
    client.user.setActivity(trackPath.split('.')[0], {
        type: 'PLAYING'
    });
    const audio = createAudioResource(join(__dirname, `../../../music/${trackStation}/${trackPath}`));
    player.play(audio);
}
//# sourceMappingURL=play.js.map