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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../botconfig.json');
const commands = [
    new SlashCommandBuilder().setName('play').setDescription('Start playing music!'),
    new SlashCommandBuilder().setName('stop').setDescription('Stop playing music!')
]
    .map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('Successfully registered application commands.');
    }
    catch (error) {
        console.error(error);
    }
}))();
//# sourceMappingURL=deploy-commands.js.map