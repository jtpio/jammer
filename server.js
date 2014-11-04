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
  var gameID = used.shift() || ++gameCounter;
  var g = games[gameID] = {
    'id': gameID,
    'ws': game,
    'count': 0,
    'players': {}
  };

  game.on('disconnect', function () {
    Object.keys(g.players).forEach(function (player) {
      g.players[player].emit('disconnect');
    });
    used.push(gameID);
    delete games[gameID];
  });

  game.on('updatePlayer', function (msg) {
    var toPlayer = msg.playerID;
    if (g.players[toPlayer]) {
      g.players[toPlayer].emit('message', msg);
    }
  });

  game.on('broadcast', function (msg) {
    Object.keys(g.players).forEach(function (p) {
      g.players[p].emit('message', msg);
    });
  });

  game.emit('gameID', gameID);

};

function handlePlayer (player) {
  player.on('join', function (gameID) {
    if (!games[gameID]) {
      return player.emit('join', { 'error': 'This game session does not exist' });
    }

    var g = games[gameID];
    player.gameID = gameID;
    player.id = g.count++;
    g.players[player.id] = player;
    g.ws.emit('addPlayer', { 'playerID': player.id });

  });

  player.on('disconnect', function () {
    if (player.gameID && games[player.gameID]) {
      games[player.gameID].ws.emit('removePlayer', { 'playerID': player.id });
      delete games[player.gameID].players[player.id];
    }
  });

  player.on('update', function (msg) {
    if (player.gameID && games[player.gameID]) {
      msg.playerID = player.id;
      games[player.gameID].ws.emit('updatePlayer', msg);
    }
  });

};


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
  console.log('listening on port', argv.p);
});