// Node package imports //

const fs = require( 'fs' )
const path = require( 'path' )
const { Client, Intents, Collection } = require( 'discord.js' )
const DateTime = require( 'date-and-time' )

// Data files //
const botconfig = require( '../botconfig.json' )

// Variables //
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
]})



// Logging when the bot comes online
client.on( 'ready', async () => {
    const now = DateTime.format( new Date(), 'YYYY/MM/DD HH:mm:ss' )

    console.log( `[${now}] ${client.user.username} is online` )

    await client.user.setActivity("no music!", {
        type: 'PLAYING'
    })
})



// Creating a list to store all commands
client.commands = new Collection()

const modules = [ 'music' ]

modules.forEach( c => {
    fs.readdir(path.join(__dirname, "commands", c), ( err, files ) => {

        if ( err ) console.log( err )

        let jsfile = files.filter( f => f.split( '.' ).pop() === 'js' )
        if( jsfile.length <= 0 ) {
            return console.log( '[LOG] Couldn\'t find commands!' )
        }

        jsfile.forEach((f, i) => {
            const command = require(path.join(__dirname, "commands", c, f))
            client.commands.set( command.data.name, command )
        })
    })
})



// If the command is a interaction known by the bot, run it
client.on('interactionCreate', async interaction => {
	if (! interaction.isCommand() ) return

	const command = client.commands.get( interaction.commandName )

	if (! command ) return

	try {
		await command.execute( client, interaction )
	} catch (error) {
		console.error(error)
		await interaction.reply( { content: 'There was an error while executing this command!', ephemeral: true } )
	}
})

// If the Switch button is pressed, switch to the station chosen by the user
client.on('interactionCreate', async interaction => {
	if (! interaction.isButton()) return;
    if( interaction.customId.split(' - ')[0] !== 'switch') await interaction.reply( { content: 'There was an error while executing this command!', ephemeral: true } )
    
    const switchStation = interaction.customId.split(' - ').pop()

    interaction.update( { content: `Now playing music from: ${switchStation}`, components: [] } )

    await client.commands.get( 'stop' ).execute( client, interaction, switchStation )
});

// Start the bot
client.login(botconfig.token)