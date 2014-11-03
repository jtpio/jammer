'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require(__dirname + '/util.js');

app.use(express.static(__dirname + '/public'));

var argv = require('yargs')
    .usage('Usage: -p [port]')
    .default('p', 4321)
    .argv;

var games = {};

var handleGame = function (game) {
    var gameSession = util.randomString(5);
    var g = games[gameSession] = {
        'id': gameSession,
        'ws': game,
        'count': 0,
        'players': {}
    };

    game.on('disconnect', function () {
        Object.keys(g.players).forEach(function (player) {
            g.players[player].emit('disconnect');
        });
        delete games[gameSession];
    });

    game.on('message', function (msg) {
        var toPlayer = msg.player;
        if (g.players[toPlayer]) {
            game.emit('message', msg);
        } else {
            game.emit('message', { 'error': 'Player ' + toPlayer + ' does not exist' });
        }
    });

    game.on('broadcast', function (msg) {
        Object.keys(g.players).forEach(function (p) {
            g.players[p].emit('message', msg);
        });
    });

};

var handlePlayer = function (player) {
    player.on('join', function (gameSession) {
        if (!games[gameSession]) {
            return player.emit('join', { 'error': 'This game session does not exist' });
        }

        var g = games[gameSession];
        player.gameSession = gameSession;
        player.id = g.count++;
        g.players[player.id] = player;
        g.ws.emit('addPlayer', player.id);

    });

    player.on('disconnect', function () {
        if (player.gameSession) {
            var g = games[player.gameSession];
            g.ws.emit('removePlayer', { 'playerID': player.id });
            delete g.players[player.id];
        }
    });

    player.on('update', function (msg) {
        if (player.gameSession && games[player.gameSession]) {
            msg.playerID = player.id;
            games[player.gameSession].ws.emit('updatePlayer', msg);
        }
    });
};

io.on('connection', function (socket) {
    socket.on('type', function (msg) {
        if (msg === 'game') {
            handleGame(socket);
        } else if (msg === 'player') {
            handlePlayer(socket);
        }
    });
});

http.listen(argv.p, function(){
    console.log('listening on port', argv.p);
});