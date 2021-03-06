// Node package imports //

import { Client, Collection, Intents } from 'discord.js'
import path from 'path'
import fs from 'fs'
import DateTime from 'date-and-time'
import { getVoiceConnection } from '@discordjs/voice'
import { StationsInteractions } from './commands/music/stations'


// Data files //
const botconfig = require('../botconfig.json')

// Variables //
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
})



// Logging when the bot comes online
client.on('ready', async () => {
  const now = DateTime.format(new Date(), 'YYYY/MM/DD HH:mm:ss')

  console.log(`[${now}] ${client.user.username} is online`)

  await client.user.setActivity("no music!", {
    type: 'PLAYING'
  })
})



// Creating a list to store all commands
client.commands = new Collection()

const modules = ['music']

modules.forEach(c => {
  fs.readdir(path.join(__dirname, "commands", c), (err, files) => {

    if (err) console.log(err)

    let jsfile = files.filter(f => f.split('.').pop() === 'js')
    if (jsfile.length <= 0) {
      return console.log('[LOG] Couldn\'t find commands!')
    }

    jsfile.forEach((f, i) => {
      const command = require(path.join(__dirname, "commands", c, f))
      client.commands.set(command.data.name, command)
    })
  })
})



// If the command is a interaction known by the bot, run it
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(client, interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  let cmd = interaction.customId.split(" - ")[0];

  if (cmd === "switch") {
    // If the Switch button (/play command) is pressed, switch to the station chosen by the user
    const [, switchStation, userID] = interaction.customId.split(' - ');
    const member = await interaction.guild.members.fetch(interaction.user.id)
    if (userID !== interaction.user.id) return await interaction.reply({ content: 'This button is only usable by the user that executed the command.', ephemeral: true })

    if (member.voice && member.voice.channel) {
      const connection = getVoiceConnection(member.voice.channel.guild.id)
      if (connection) {

        interaction.update({ content: `Now playing music from: ${switchStation}`, components: [] })

        await client.commands.get('stop').execute(client, interaction, switchStation)
      } else {
        await interaction.reply({ content: 'I\'m not playing music so I can\'t switch to another station!', ephemeral: true })
      }
    } else {
      await interaction.reply({ content: 'You need to be in a voice channel to use this button!', ephemeral: true })
    }
  } else if (cmd === "stationsList") {
    // If the Next button (/stations command) is pressed, show the next stations
    await client.commands.get("stations").execute(client, interaction, interaction.customId.split(" - ")[1]);
  }
});

// Start the bot
client.login(botconfig.token)
