#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var destination = '.';

var files = [
	'public/game.html',
	'public/player.html',
	'public/js/gameClient.js',
	'public/js/gameServer.js',
	'server.js'
];

fs.mkdirSync(destination + '/public');
fs.mkdirSync(destination + '/public/js');

var inputFiles = files.map(function (file) {
	var str = fs.readFileSync(path.resolve(__dirname, '../' + file));
	console.log('Creating ' + file);
	fs.writeFileSync(path.resolve(destination, file), str);
});

// copy package.json
var str = fs.readFileSync(path.resolve(__dirname, '../package_jammer.json'));
console.log('Creating package.json');
fs.writeFileSync(path.resolve(destination, 'package.json'), str);

spawn('npm', ['install']);