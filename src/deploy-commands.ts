export {}

const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { REST } = require( '@discordjs/rest' );
const { Routes } = require( 'discord-api-types/v9' );

const { clientId, guildId, token } = require( '../botconfig.json' );

const commands = [
	new SlashCommandBuilder().setName( 'play' ).setDescription( 'Start playing music!' ),
	new SlashCommandBuilder().setName( 'stop' ).setDescription( 'Stop playing music!' )
]
	.map( command => command.toJSON() );

const rest = new REST({ version: '9' }).setToken( token );

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands( clientId, guildId ),
			{ body: commands },
		);

		console.log( 'Successfully registered application commands.' );
	} catch ( error ) {
		console.error( error );
	}
})();