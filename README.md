# Get Started
1. Download and install [Visual Studio Code](https://code.visualstudio.com/download)
2. Install [Node.js](https://nodejs.org/dist/v6.10.2/node-v6.10.2-x64.msi)
3. Install some tools `> npm install --global firebase-tools firebase-bolt typescript`
    - [Firebase Tools](https://github.com/firebase/firebase-tools) - for deploying stuff to firebase
    - [Firebase bolt](https://github.com/firebase/bolt/blob/master/docs/guide.md) - for writing security rules
    - [Typescript](http://www.typescriptlang.org/docs/tutorial.html) - for writing the triggers
4. `> git clone https://github.com/Danifayn/Texas-Hold-em-game-center.git TexasHoldem`
5. Open the newly created `TexasHoldem` directory in Visual Studio Code
6. Code away.

# Overview
Basically you need to know two things:
1. `functions/src` is where you write triggers for firebase in a language called `Typescript`
    - [Get started & Documentation](https://firebase.google.com/docs/functions/get-started)
    - `.../TexasHoldem/functions> npm run functions` - update triggers on the server
    - the file `functions/src/index.ts` contains an example defining two triggers
2. `database.rules.bolt` is where you define security rules for the database in a language called `Bolt`
    - [Get started & Documentation](https://github.com/firebase/bolt/blob/master/docs/guide.md)
    - `.../TexasHoldem> firebase deploy --only database` - update security rules on the server
3. Quick tip - `ctrl + ~` opens the built-in terminal in Visual Studio Code

# How to access the firebase console
1. Go to [Firebase](firebase.google.com)
2. Login using:
    - Email - `texas.holdem.workshop@gmail.com`
    - Password - `texas shuffle`
2. Press `go to console`
