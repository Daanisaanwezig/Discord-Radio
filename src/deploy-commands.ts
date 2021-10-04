export {}

const fs = require( 'fs' )
const path = require( 'path' )
const { SlashCommandBuilder } = require( '@discordjs/builders' )
const { REST } = require( '@discordjs/rest' )
const { Routes } = require( 'discord-api-types/v9' )

const { clientId, guildId, token } = require( '../botconfig.json' )


let commands = []
const modules = [ 'music' ]

const rest = new REST({ version: '9' }).setToken(token);



getCommands().then( async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands( clientId, guildId ),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch ( error ) {
		console.error( error );
	}
})



function getCommands() {
	let promise = new Promise( ( resolve, reject ) => {

		modules.forEach( (c, commandsIndex ) => {
			fs.readdir(path.join(__dirname, "commands", c), ( err, files ) => {
		
				if ( err ) console.log( err )
		
				let jsfile = files.filter( f => f.split( '.' ).pop() === 'js' )
				if( jsfile.length <= 0 ) {
					return console.log( '[LOG] Couldn\'t find commands!' )
				}
		
				jsfile.forEach((f, fileIndex) => {
					const command = require( path.join(__dirname, "commands", c, f) )
					commands.push( command.data.toJSON() )


					if ( jsfile.length - 1 == fileIndex && modules.length -1 == commandsIndex ) {
						resolve( commands )
					}					
				})
			})
		})
	})
	return promise
}