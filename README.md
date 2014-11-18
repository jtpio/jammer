# Jammer - A server for your game jam

Jammer is a ready to use game server to speed up game creation in the context of game jams, for **web based** games.


## Install
    npm install jammer -g
    
## Usage
Run:

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



## Motivation
A game jam is all about making a great game fast, so you shouldn't spend to much time in repetitive and time consuming tasks.
If you want to go for a multi-player game, you are going to spend quite a lot of time on the network part, testing it, debugging it. We all know, the network never works.


This idea popped up after using HappyFunTimes in a game jam. HappyFunTimes is great, but is limited to a local network. The missing part for us was to be able to put the game somewhere to make it accessible by everyone.
Jammer uses game sessions to make it work with multiple game running at the same time. Once your game jam is done and you want to share your creation with the rest of the world, you can just deploy the code.

## License
MIT
