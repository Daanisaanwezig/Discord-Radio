import { CommandInteraction, MessageEmbed } from "discord.js";

export { };

// Node package imports //
const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription(
      "Replies with the name of the song currently being played!"
    ),
  async execute(client, interaction: CommandInteraction) {
    const name = client.user.presence?.activities[0]?.name;

    if (name === undefined || name === "no music!") {
      const noCurrentSong = new MessageEmbed()
        .setTitle(`There is no song being played! 😒`)
        .setDescription("I'm not playing any song right now.")
        .setFooter("Play one of these using /play");
      return await interaction.reply({ embeds: [noCurrentSong] })
    }
    const currentSongEmbed = new MessageEmbed()
      .setTitle(`Current Song: ${name}`)
      .setDescription(name)
      .setFooter("Stop the song by typing /stop");

    return await interaction.reply({ embeds: [currentSongEmbed] });
  },
};
