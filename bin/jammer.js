#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var destination = '.';

var files = [
	'public/game.html',
	'public/player.html',
	'public/js/gameClient.js',
	'public/js/gameServer.js',
	'server.js',
	'package.json'
];

fs.mkdirSync(destination + '/public');
fs.mkdirSync(destination + '/public/js');

var inputFiles = files.map(function (file) {
	var str = fs.readFileSync(path.resolve(__dirname, '../' + file));
	console.log('Creating ' + file);
	fs.writeFileSync(path.resolve(destination, file), str);
});

