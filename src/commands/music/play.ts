import { folderExists } from "../../util";

export{}

// Node package imports //
const fs = require( 'fs' )
const { join } = require( "path" )
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, getVoiceConnection } = require( "@discordjs/voice" )
const { SlashCommandBuilder } = require( '@discordjs/builders' )

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start playing music!')
        .addStringOption( option => option
            .setName( 'station' )
            .setDescription( 'Choose the radio station' )
            .setRequired( true )),
	async execute( client, interaction ) {

        const station = interaction.options.getString( 'station' ).toLowerCase()

        if (! folderExists( `../music/${station}`) ) {
            return await interaction.reply( 'I could not find that radio station, are you sure it exists?' )
        }
        fs.readdirSync( `../music/${station}`, async ( err, files ) => {
            if (! files ) {
                return await interaction.reply( 'I could not find that radio station, are you sure it exists?' )
            }
        })


        const voiceChannel = interaction.member.voice

        // If the user is not in a voice channel, return and notify
        if (! voiceChannel.channelId ) {
            return await interaction.reply( 'Please make sure to join a channel before running this command.' )
        }

        // If the bot is already playing music, return and notify
        const connection = getVoiceConnection( voiceChannel.guild.id )
        if ( connection ) {
            if ( connection.joinConfig.channelId == voiceChannel.channelId ) {
                return await interaction.reply( 'I am already playing music in your channel.' )
            } else {
                return await interaction.reply( 'I am already playing music somewhere else.' )
            }
        }

        // Create a new voice connection
        const voiceConnection = await joinVoiceChannel({
            channelId: voiceChannel.channelId,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        })

        // Create a new audio player
        const player = await createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        })

        // Connect the voice connection and audio player
        voiceConnection.subscribe( player )

        // Start playing music and notify
        await interaction.reply( `Started playing music in <#${voiceChannel.channelId}>` )

        initPlayer()

        function initPlayer() {
            getTracks( station ).then( async tracklist => {

                // If the music folder is empty return and notify the user
                if ( tracklist.length == 0 ) {
                    return await interaction.reply( 'There is no music to play, please make sure the music folder contains `mp3` files.' )
                }
                let trackPath = tracklist.shift()

                playTrack( client, player, station, trackPath )
    
                // Idle event that fires when the bot is no longer playing a track
                player.on( AudioPlayerStatus.Idle, async () => {
                    if ( tracklist.length == 0 ) {
                        return initPlayer()
                    }
    
                    trackPath = tracklist.shift()
                    playTrack( client, player, station, trackPath )
                })

                // If there is any error whilst playing a track, log it
                player.on( 'error', error => {
                    console.error('Error:', error.message)
                })
            })
        }
	}
}

function getTracks( station ) {

    // Create a promise that returns a list of all tracks in the music folder
    const promise = new Promise<String[]>((resolve, reject) => {
        // reject the promise if the station doesn't exist
        if (!folderExists(`../music/${station}`)) reject();

        let tracklist = []
        fs.readdir( `../music/${station}`, ( err, files ) => {
            if ( err ) console.log( err )

            let tracks = files.filter( f => f.split( '.' ).pop() === 'mp3' )
            tracks.forEach( track => {
                tracklist.push( track )
                if ( track == tracks[ tracks.length - 1 ] ) {
                    // Resolve the promise with a shuffled list of tracks
                    resolve( tracklist.sort( () => ( Math.random() > .5 ) ? 1 : -1 ) )
                }
            })
        })
    })

    return promise
}

function playTrack( client, player, trackStation, trackPath ) {

    // Set the status of the bot to the track currently playing
    client.user.setActivity( trackPath.split( '.' )[0], {
        type: 'PLAYING'
    })

    // Create a new audio stream and play the track
    const audio = createAudioResource( join( __dirname, `../../../music/${trackStation}/${trackPath}` ) )
    player.play( audio )
}