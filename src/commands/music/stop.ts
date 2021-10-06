import { getVoiceConnection } from "@discordjs/voice"

export{}

// Node package imports //
const fs = require( 'fs' )
const { join } = require( "path" )
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require( "@discordjs/voice" )
const { SlashCommandBuilder } = require( '@discordjs/builders' )

// Import play command in case of switching stations
const play = require( './play' )

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop playing music!'),
	async execute( client, interaction, switchStation ) {

        const voiceChannel = interaction.member.voice

        if (! voiceChannel ) {
            await interaction.reply( 'Please make sure to join a channel before running this command.' )
        } else {
            const connection = getVoiceConnection( voiceChannel.guild.id )

            // If the bot is not playing music, return and notify
            if (! connection ) return await interaction.reply( 'I am not playing music.' )
            // If the user is not in the voice channel the bot is playing music in, return and notify
            if ( connection.joinConfig.channelId != voiceChannel.channelId ) return await interaction.reply( 'I am not playing music in the channel you are in.' )

            // Stop playing music
            connection.destroy()
            if(!switchStation) await interaction.reply( 'Stopped playing music.' )
            // switch to new station
            else await play.execute( client, interaction, switchStation ) 
            
            await client.user.setActivity("no music!", {
                type: 'PLAYING'
            })
        }
	}
}