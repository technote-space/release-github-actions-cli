"use strict";

process.env.INPUT_ACCESS_TOKEN = "dummy";
const command = require( "./lib/utils/command" );

( async function() {
	await command.config();
	await command.commit();
} )();
