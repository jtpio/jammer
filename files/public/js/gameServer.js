(function () {

  'use strict';

  var obj = this;
  var net = null;
  var listeners = {};
  var players = {};

  // Handlers
  function gameID (id) {
    sendEvent('gameID', [id]);
  }

  function addPlayer (msg) {
    var id = msg.playerID;
    if (players[id]) return;

    players[id] = new PlayerConnection(id);
    sendEvent('newPlayer', [players[id]]);
  }

  function removePlayer  (msg) {
    var id = msg.playerID;
    var player = players[id];
    if (!player) return;

    player.forward('disconnect', []);
    delete players[id];
  }

  function updatePlayer (msg) {
    var player = players[msg.playerID];
    if (!player) return;

    player.forward(msg.cmd, [msg.data]);
  }

  // Constructor
  var GameServer = function () {
    net = io();
    // Reserved events
    net.on('connect', onConnect);
    net.on('disconnect', onDisconnect);
    net.on('gameID', gameID);
    net.on('addPlayer', addPlayer);
    net.on('removePlayer', removePlayer);
    net.on('updatePlayer', updatePlayer);
    net.on('error', console.error);
  };

  var onConnect = function () {
    net.emit('type', 'game');
  };

  var onDisconnect = function () {
    sendEvent('disconnect');
    for (var p in players) {
      removePlayer(p);
    }
  };

  GameServer.prototype.on = function (type, callback) {
    if (!listeners.hasOwnProperty(type)) {
      listeners[type] = callback;
    }
  };

  function sendEvent (type, args) {
    var callback = listeners[type];
    if (callback) {
      callback.apply(callback, args);
    }
  }

  var PlayerConnection = function(id) {
    this.id = id;
    this.handlers = {};
  };

  PlayerConnection.prototype.send = function(cmd, data) {
    net.emit('updatePlayer', {'cmd': cmd, 'playerID': this.id, 'data': data || {}});
  };

  PlayerConnection.prototype.on = function(type, handler) {
    this.handlers[type] = handler;
  };

  PlayerConnection.prototype.off = function(type) {
    if (type === undefined) {
      this.handlers = {};
    } else {
      this.handlers[type] = undefined;
    }
  };

  PlayerConnection.prototype.forward = function(type, args) {
    var fn = this.handlers[type];
    if (fn) {
      fn.apply(this, args);
    } else {
      console.info('Unknown Event: ' + type);
    }
  };

  if (typeof define !== 'undefined' && define.amd) {
    obj.GameServer = GameServer;
    define(function() {
      return GameServer;
    });
  } else {
    obj.GameServer = GameServer;
  }

}).call(this);
