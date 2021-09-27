var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const DateTime = require('date-and-time');
const botconfig = require('../botconfig.json');
const client = new Client({ intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
    ] });
const prefix = botconfig.prefix;
client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    const now = DateTime.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    console.log(`[${now}] ${client.user.username} is online`);
}));
client.commands = new Collection();
const modules = ['music'];
modules.forEach(c => {
    fs.readdir(`./commands/${c}`, (err, files) => {
        if (err)
            console.log(err);
        let jsfile = files.filter(f => f.split('.').pop() === 'js');
        if (jsfile.length <= 0) {
            return console.log('[LOG] Couldn\'t find commands!');
        }
        jsfile.forEach((f, i) => {
            const command = require(`./commands/${c}/${f}`);
            client.commands.set(command.data.name, command);
        });
    });
});
client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        yield command.execute(client, interaction);
    }
    catch (error) {
        console.error(error);
        yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}));
client.on('messageCreate', message => {
    if (message.author.bot)
        return;
    let messageArray = message.content.split(' ');
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if (message.content.startsWith(prefix)) {
        let commandFile = client.commands.get(cmd.slice(prefix.length)) ||
            client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
        if (commandFile)
            commandFile.run(client, message, args);
        else if (!commandFile)
            message.channel.send(`I am not able to find that command. Use \`${prefix}help\` to get a list of all commands.`);
    }
});
client.login(botconfig.token);
//# sourceMappingURL=index.js.map