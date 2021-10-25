import { randomUUID } from "crypto";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { copyFileSync } from "fs";
import { folderExists, getStations, stationExists, STATIONS_LIST_MAX_ITEMS } from "../../util";

export { }

// Node package imports //
const fs = require('fs')
const { join } = require("path")
const { SlashCommandBuilder } = require('@discordjs/builders')

interface StationsMessage {
  interaction: CommandInteraction,
  page: number,
  id: string
}

// this class keeps track of running /stations commands
export class StationsInteractions {
  static activeButtons: StationsMessage[] = [];

  // get a StationsMessage object by ID
  static getInteractionByID(id: string): StationsMessage {
    for (let button of this.activeButtons) {
      if (button.id === id) {
        return button;
      }
    }
  }

  // increment the page index of the interaction matching the given ID and return the new page index
  static incrementPage(id: string) {
    for (let button of this.activeButtons) {
      if (button.id === id) {
        button.page++;
        return button.page;
      }
    }
  }

  // insert a new StationsMessage object
  static addInteraction(interaction: CommandInteraction, id: string) {
    let newStationsMessage: StationsMessage = {
      interaction: interaction,
      id: id,
      page: 0
    };
    this.activeButtons.push(newStationsMessage);
  }
}

module.exports = {
  musicFolder: join(__dirname, "..", "..", "..", "music"),
  data: new SlashCommandBuilder()
    .setName('stations')
    .setDescription('Lists available stations to play!'),
  async execute(client, interaction: CommandInteraction, lastInteractionID) {
    if (!folderExists(this.musicFolder)) {
      return await interaction.reply("I couldn't find the music folder, are you sure it exists?")
    }

    // if an lastInteractionID was given, use that to determine the page to display
    // otherwise 0 if this is a direct call of /stations
    let pageIdx;
    if (lastInteractionID !== undefined) {
      pageIdx = StationsInteractions.incrementPage(lastInteractionID);
    } else {
      pageIdx = 0;
    }

    // get the next page of stations
    await getStations(this.musicFolder, pageIdx).then(async (stationsList) => {
      // format the station names
      const stationsStr = stationsList.stations.map((station) => {
        return `- ${this.capitalize(station)}`
      }).join("\n")

      // create the list
      const stationsEmbed = new MessageEmbed()
        .setTitle(`Available stations, page ${pageIdx + 1}:`)
        .setDescription(stationsStr)
        .setFooter("Play one of these using /play");
      
      let row = new MessageActionRow();

      // add a button to show the next page if there are more stations to be displayed
      if (stationsList.next) {
        if (lastInteractionID === undefined) {
          // if this is a direct call to /stations: generate a new UUID to identify this action
          let uuid = randomUUID();
          StationsInteractions.addInteraction(interaction, uuid);
          row.addComponents(
              new MessageButton()
                .setCustomId(`stationsList - ${uuid}`)
                .setLabel('Show next ' + STATIONS_LIST_MAX_ITEMS)
                .setStyle('PRIMARY'),
            );
        } else {
          // if this was the result of a button click, reuse the same interactionID
          row.addComponents(
              new MessageButton()
                .setCustomId(`stationsList - ${lastInteractionID}`)
                .setLabel('Show next ' + STATIONS_LIST_MAX_ITEMS)
                .setStyle('PRIMARY'),
            );
          
        }
      } else {
        // this is the last page => show a disabled button
        row.addComponents(
            new MessageButton()
              .setCustomId("null")
              .setLabel('No more stations to display')
              .setDisabled(true)
              .setStyle('SECONDARY'),
          );
      }

      if (lastInteractionID !== undefined) {
        // get the last message...
        let editInteraction = StationsInteractions.getInteractionByID(lastInteractionID).interaction;
        // and delete it
        editInteraction.deleteReply();

        // update the interaction, so the message sent below can be deleted later.
        StationsInteractions.getInteractionByID(lastInteractionID).interaction = interaction;
      }

      // send a new list
      await interaction.reply({ embeds: [stationsEmbed], components: [row] });
    }).catch((err) => {
      return interaction.reply(err)
    })
  },

  capitalize(text: string) {
    const [first, ...rest] = text.toLowerCase()
    return `${first.toUpperCase()}${rest.join("")}`
  }
}

