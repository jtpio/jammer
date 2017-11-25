# Jammer - A server for your game jam

Jammer is a ready-to-use game server to speed up game creation in the context of game jams.

It is written in Javascript so it focuses on **web based** games.

It is designed for games with multiple players playing simultaneously on the same screen.

## Usage

### Docker

To run the server in a docker container, and mount your front-end files:

	docker build -t $USER/jammer .
	docker run -t --name=jammer -v /path/to/your/public/files:/app/public:ro -p 4321:4321 $USER/jammer

Doing so, you only have to provide the files doing the client side work, and let node serve them. This is the easiest way to get started. Even though the server will run in a docker container, it is still possible to modify it and rebuild an image, in case you have specific requirements.

The files are served from the `/app/public` folder. So if you have two files named `game.html` and `player.html`, visit [localhost:4321/game.html](http://localhost:4321/game.html) to create a game instance and [localhost:4321/player.html](http://localhost:4321/player.html) to spawn up a player.

### Install and run manually

It is also possible to run jammer manually by first installing node.js, and then:

    npm install jammer -g

Followed by:

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
### Examples
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

There is a global depedency on socket.io, so make sure to include it (see example).

#### Game examples using jammer

- [TwinFusion](https://github.com/jtpio/twin-fusion): made at a game jam, but using a previous version (different API).
- [Squame](https://github.com/jtpio/squame): proof of concept for jammer.

### GameServer

``` js
var gameServer = new GameServer();
var players = {};
gameServer.on('gameID', function (gameID) {
    // display the game ID on screen for the players
});

gameServer.on('newPlayer', function (player) {
    // player connected
    var playerID = player.id;
    players[playerID] = player; // save it for later use
    player.x = Math.random() * 500;
    player.y = Math.random() * 500;
    player.size = 50;

    // Player listeners
    // Example of a player event: changeSize
    player.on('changeSize', function (size) {
        player.size = size || 50;
    });

    // Send command to the player
    player.send('changeColor', '#FF0000');

    player.on('disconnect', function () {
        delete players[player.id];
    });
});
```

### GameClient

``` js
var gameClient = new GameClient();
gameClient.join(12); // join the game 12

gameClient.on('joined', function () {
    // player joined, do something with it, for example change the size
    gameClient.send('changeSize', Math.random() * 100 + 100);
});

gameClient.on('changeColor', function (color) {
  // change the color of the player
});
```

## List of defaults events and actions
### On the game side
``` js
gameServer.on('gameID', function (gameID) {
    // Do something here to display the game ID on the screen for the players
});
gameServer.on('newPlayer', function (player) {
    // A new player just joined, do something with the player object, store it for later use

    // Default events for the player
    player.on('disconnect', function () {
        // Player disconnected, do something with, remove it from the game for example
    });
});
gameServer.on('disconnect', function (player) {
    // The game disconnected, could be due to network problems, display something to the players or die silently
});
```

### On the player side
``` js
// join game number 2
gameClient.join(2);

gameClient.on('joined', function () {
   // the player joined the game, display controller or anything else
});
```


## Motivation
A game jam is all about making a great game fast, so you shouldn't spend to much time in repetitive and time consuming tasks.
If you want to go for a multi-player game, you are going to spend quite a lot of time on the network part, testing it, debugging it.


This idea popped up after using [HappyFunTimes](https://github.com/greggman/HappyFunTimes) in a game jam. HappyFunTimes is great, but is limited to a local network. The missing part for us was to be able to put the game online to make it accessible by everyone.
Jammer uses game sessions to make it work with multiple game running at the same time.

## License
MIT
