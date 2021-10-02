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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../botconfig.json');
let commands = [];
const modules = ['music'];
const rest = new REST({ version: '9' }).setToken(token);
getCommands().then(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Started refreshing application (/) commands.');
        yield rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
}));
function getCommands() {
    let promise = new Promise((resolve, reject) => {
        modules.forEach((c, commandsIndex) => {
            fs.readdir(`./commands/${c}`, (err, files) => {
                if (err)
                    console.log(err);
                let jsfile = files.filter(f => f.split('.').pop() === 'js');
                if (jsfile.length <= 0) {
                    return console.log('[LOG] Couldn\'t find commands!');
                }
                jsfile.forEach((f, fileIndex) => {
                    const command = require(`./commands/${c}/${f}`);
                    commands.push(command.data.toJSON());
                    if (jsfile.length - 1 == fileIndex && modules.length - 1 == commandsIndex) {
                        resolve(commands);
                    }
                });
            });
        });
    });
    return promise;
}
//# sourceMappingURL=deploy-commands.js.map