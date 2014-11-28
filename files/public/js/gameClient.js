(function () {

  'use strict';

  var obj = this;
  var net = null;
  var listeners = {};

  var GameClient = function () {
    net = io();
    net.on('connect', onConnect);
    net.on('disconnect', onDisconnect);
    net.on('message', onMessage);
    net.on('error', console.error);
  };

  GameClient.prototype.addEventListener = function (type, callback) {
    if (!listeners.hasOwnProperty(type)) {
      listeners[type] = callback;
    }
  };

  GameClient.prototype.removeEventListener = function (type) {
    listeners[type] = undefined;
  };

  GameClient.prototype.sendCommand = function (cmd, data) {
    net.emit('update', {'cmd': cmd, 'data': data || {}});
  };

  GameClient.prototype.join = function(gameID) {
    net.emit('join', gameID);
  };

  var onConnect = function () {
    net.emit('type', 'player');
  };

  var onDisconnect = function () {
    sendEvent('disconnect');
  };

  var onMessage = function (msg) {
    sendEvent(msg.cmd, [msg.data]);
  };

  function sendEvent (type, args) {
    var callback = listeners[type];
    if (callback) {
      callback.apply(callback, args);
    } else {
      console.info('Received event: ' + type + ', not handled');
    }
  }

  if (typeof define !== 'undefined' && define.amd) {
    obj.GameClient = GameClient;
    define(function() {
      return GameClient;
    });
  } else {
    obj.GameClient = GameClient;
  }

}).call(this);
