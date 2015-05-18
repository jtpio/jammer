#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var destination = process.argv[2] || '.';

var files = [
	'public/game.html',
	'public/player.html',
	'public/js/gameClient.js',
	'public/js/gameServer.js',
	'public/lib/socket.io-1.3.5.js',
	'server.js',
	'package.json'
];

var dirs = [
	'public',
	'public/js',
	'public/lib'
];

dirs.forEach(function (dir) {
	console.log(path.resolve(destination, dir));
	if (!fs.existsSync(path.resolve(destination, dir))) {
		fs.mkdirSync(path.resolve(destination, dir));
	}
});

var inputFiles = files.map(function (file) {
	var str = fs.readFileSync(path.resolve(__dirname, '../files', file));
	console.log('Creating ' + file);
	fs.writeFileSync(path.resolve(destination, file), str);
});

console.log('Installing node modules ... ');
process.chdir(destination);
var nodeModules = spawn('npm', ['install']);

nodeModules.on('close', function (code) {
  console.log('...done');
});
