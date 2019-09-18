"use strict";

if ( process.argv.length < 5 ) {
	console.error( "Usage: node prepare <owner> <repo> <tag>" );
	return;
}

process.env.INPUT_ACCESS_TOKEN = "dummy";
const command = require( "./lib/utils/command" );
const misc = require( "./lib/utils/misc" );

if ( ! misc.isValidTagName( process.argv[ 4 ] ) ) {
	console.error( "Invalid tag name: " + process.argv[ 4 ] );
	return;
}
command.prepareCommit( {
	payload: {
		action: "published",
		release: {
			"tag_name": process.argv[ 4 ],
		},
	},
	eventName: "release",
	ref: "refs/heads/master",
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
