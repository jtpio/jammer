# Jammer - A server for your game jam

Jammer is a ready to use game server to speed up game creation in the context of game jams.

It is written in Javascript so it focuses on **web based** games.

It is designed for games with multiple players playing simultaneously on the same screen. 

## Install
Install node.js, then:

    npm install jammer -g
    
## Usage
    jammer

This will generate all the files you need in the current working directory and run *npm install* automatically: 
```
public/game.html
public/player.html
public/js/gameClient.js
public/js/gameServer.js
server.js
package.json
node_modules/
```

Then:
    
    node server.js

And you have a server listening on **port 4321**. To start the server listening on port 7890:

    node server.js -p 7890

To generate the files at a specific path:
    
    jammer /path/to/destination/

## Documentation
## Examples
The generated files include an example showing the basics.

```
public/player.html
public/game.html
```

They include or the Javascript files:
```
public/js/gameClient.js
public/js/gameServer.js
```

### GameServer

``` js
var gameServer = new GameServer();
var players = {};
gameServer.addEventListener('gameID', function (gameID) {
    // display the game ID on screen for the players
});

gameServer.addEventListener('newPlayer', function (player) {
    // player connected
    var playerID = player.id;
    players[playerID] = player; // save it for later use
    player.x = Math.random() * 500;
    player.y = Math.random() * 500;
    player.size = 50;

    // Player listeners
    // Example of a player event: changeSize
    player.addEventListener('changeSize', function (size) {
        player.size = size || 50;
    });
    
    // Send command to the player
    player.sendCmd('changeColor', '#FF0000');
});

player.addEventListener('disconnect', function () {
    delete players[player.id];
});
```

### GameClient

``` js
var gameClient = new GameClient();
gameClient.join(12); // join the game 12

gameClient.addEventListener('joined', function () {
    // player joined, do something with it, for example change the size
    gameClient.sendCmd('changeSize', Math.random() * 100 + 100);
});

gameClient.addEventListener('changeColor', function (color) {
  // change the color of the player
});
```

## List of events
### GameServer

### GameClient

## Motivation
A game jam is all about making a great game fast, so you shouldn't spend to much time in repetitive and time consuming tasks.
If you want to go for a multi-player game, you are going to spend quite a lot of time on the network part, testing it, debugging it. We all know, the network never works.


This idea popped up after using HappyFunTimes in a game jam. HappyFunTimes is great, but is limited to a local network. The missing part for us was to be able to put the game somewhere to make it accessible by everyone.
Jammer uses game sessions to make it work with multiple game running at the same time. Once your game jam is done and you want to share your creation with the rest of the world, you can just deploy the code.

## License
MIT
