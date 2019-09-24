'use strict';

if ( process.argv.length < 7 ) {
	console.error( 'Usage: node push <owner> <repo> <tag> <token> <ref>' );
	process.exit( 1 );
	return;
}

process.env.INPUT_GITHUB_TOKEN = process.argv[ 5 ];
process.env.GITHUB_ACTOR = process.argv[ 2 ];
const command = require( './lib/utils/command' );
const misc = require( './lib/utils/misc' );

if ( ! misc.isValidTagName( process.argv[ 4 ] ) ) {
	console.error( 'Invalid tag name: ' + process.argv[ 4 ] );
	process.exit( 1 );
	return;
}

( async function() {
	try {
		await command.prepareCommit( {
			payload: {
				action: 'published',
				release: {
					'tag_name': process.argv[ 4 ],
				},
			},
			eventName: 'release',
			ref: process.argv[ 6 ] ? `refs/heads/${ process.argv[ 6 ] }` : 'refs/heads/master',
			sha: '',
			workflow: '',
			action: '',
			actor: '',
			issue: {
				owner: '',
				repo: '',
				number: 1,
			},
			repo: {
				owner: process.argv[ 2 ],
				repo: process.argv[ 3 ],
			},
		} );
	} catch ( error ) {
		console.error( error );
		process.exit( 1 );
	}
} )();
