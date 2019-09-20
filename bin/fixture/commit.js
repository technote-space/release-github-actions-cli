'use strict';

process.env.INPUT_GITHUB_TOKEN = 'dummy';
const command = require( './lib/utils/command' );

( async function() {
	try {
		await command.config();
		await command.commit();
	} catch ( error ) {
		console.error( error );
		process.exit( 1 );
	}
} )();
