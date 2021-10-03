import {CommandInteraction, MessageEmbed} from "discord.js";

export{}

// Node package imports //
const fs = require( 'fs' )
const path = require( "path" )
const { SlashCommandBuilder } = require( '@discordjs/builders' )

module.exports = {
  musicFolder: path.join(__dirname, "../../..", "music"),
  data: new SlashCommandBuilder()
    .setName('stations')
    .setDescription('Lists available stations to play!'),
  async execute( client, interaction: CommandInteraction) {
    if (!fs.existsSync(this.musicFolder)) {
      return await interaction.reply( "I couldn't find the music folder, are you sure it exists?" )
    }
    fs.readdir(this.musicFolder, ( err, stations ) => {
        if ( err ) console.log( err );
        if (!stations.length) {
          return interaction.reply("No stations found... Did you create any?")
        }

        const stationsStr = stations.map((station) => {
          return `- ${this.capitalize(station)}`
        }).join("\n")

        const stationsEmbed = new MessageEmbed()
          .setTitle("Available stations:")
          .setDescription(stationsStr)
          .setFooter("Play one of these using /play");

        interaction.reply({embeds: [stationsEmbed]})
    });
  },

  capitalize(text: string) {
    const [first, ...rest] = text.toLowerCase()
    return `${first.toUpperCase()}${rest.join("")}`
  }
}
