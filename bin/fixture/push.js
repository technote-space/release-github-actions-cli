"use strict";

if ( process.argv.length < 6 ) {
	console.error( "Usage: node push <owner> <repo> <tag> <token>" );
	process.exit( 1 );
	return;
}

process.env.INPUT_ACCESS_TOKEN = process.argv[ 5 ];
const command = require( "./lib/utils/command" );

( async function() {
	try {
		await command.push( {
			payload: {
				action: "published",
				release: {
					"tag_name": process.argv[ 4 ],
				},
			},
			eventName: "release",
			ref: process.argv.length < 7 ? "refs/heads/master" : process.argv[ 6 ],
			sha: "",
			workflow: "",
			action: "",
			actor: "",
			issue: {
				owner: "",
				repo: "",
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
