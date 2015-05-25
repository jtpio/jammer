'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var argv = require('yargs')
  .usage('Usage: -p [port]')
  .default('p', 4321)
  .argv;

var gameCounter = 0;
var used = [];
var games = {};

function handleGame (game) {
  var gameID = used.shift();
  if (!gameID || games[gameID]) {
    gameID = ++gameCounter;
  }
  game.gameID = gameID;
  game.count = 0;
  game.players = {};

  game.on('disconnect', function () {
    Object.keys(game.players).forEach(function (player) {
      game.players[player].disconnect();
    });
    used.push(gameID);
    delete games[gameID];
  });

  game.on('updatePlayer', function (msg) {
    var toPlayer = msg.playerID;
    if (game.players[toPlayer]) {
      game.players[toPlayer].emit('message', msg);
    }
  });

  game.on('broadcast', function (msg) {
    Object.keys(game.players).forEach(function (p) {
      game.players[p].emit('message', msg);
    });
  });

  games[gameID] = game;
  game.emit('gameID', gameID);
}

function handlePlayer (player) {
  player.on('join', function (gameID) {
    gameID = parseInt(gameID, 10);
    if (!games[gameID]) {
      return player.emit('joined', { 'error': 'This game session does not exist' });
    }

    var g = games[gameID];
    if (player.hasOwnProperty('gameID')) {
      return player.emit('joined', { 'error': 'The player is already part of game ' + player.gameID });
    }

    player.gameID = gameID;
    player.id = g.count++;
    g.players[player.id] = player;
    g.emit('addPlayer', { 'playerID': player.id });
    player.emit('message', { 'cmd': 'joined'});
  });

  player.on('disconnect', function () {
    if (player.gameID && games[player.gameID]) {
      games[player.gameID].emit('removePlayer', { 'playerID': player.id });
      delete games[player.gameID].players[player.id];
    }
  });

  player.on('update', function (msg) {
    if (player.gameID && games[player.gameID]) {
      msg.playerID = player.id;
      games[player.gameID].emit('updatePlayer', msg);
    }
  });

}

// Handle all the connections
io.on('connection', function (socket) {
  socket.on('type', function (msg) {
    if (msg === 'game') {
      handleGame(socket);
    } else if (msg === 'player') {
      handlePlayer(socket);
    } else {
      socket.disconnect();
    }
  });
});

http.listen(argv.p, function(){
  console.log('Server listening on port', argv.p);
});