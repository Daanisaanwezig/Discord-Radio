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
const voice_1 = require("@discordjs/voice");
const fs = require('fs');
const { join } = require("path");
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require("@discordjs/voice");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music!'),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = interaction.member.voice;
            if (!voiceChannel) {
                yield interaction.reply('Please make sure to join a channel before running this command.');
            }
            else {
                const connection = (0, voice_1.getVoiceConnection)(voiceChannel.guild.id);
                if (!connection)
                    return yield interaction.reply('I am not playing music.');
                if (connection.joinConfig.channelId != voiceChannel.channelId)
                    return yield interaction.reply('I am not playing music in the channel you are in.');
                connection.destroy();
                yield interaction.reply('Stopped playing music.');
            }
        });
    }
};
//# sourceMappingURL=stop.js.map