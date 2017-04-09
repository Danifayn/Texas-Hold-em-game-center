# Get Started
1. `> git clone https://github.com/Danifayn/Texas-Hold-em-game-center.git TexasHoldem`
2. Download and install [Visual Studio Code](https://code.visualstudio.com/download) or any other editor of your choice
3. Install [Node.js](https://nodejs.org/dist/v6.10.2/node-v6.10.2-x64.msi)
4. Install [Firebase Tools](https://github.com/firebase/firebase-tools) `> npm install --global firebase-tools`
5. Install [Firebase bolt](https://github.com/firebase/bolt/blob/master/docs/guide.md) `> npm install --global firebase-bolt`

# Overview
Basically you need to know two things:
1. `functions/index.js` is where you write triggers for firebase
    - [Get started & Documentation](https://firebase.google.com/docs/functions/get-started)
    - `firebase deploy --only functions` - update triggers on the server (all of functions folder)
2. `database.rules.bolt` is where you define security rules for the database in a language called `Bolt`
    - [Get started & Documentation](https://github.com/firebase/bolt/blob/master/docs/guide.md)
    - `firebase deploy --only database` - update security rules on the server

# How to access the firebase console
1. Go to [Firebase](firebase.google.com)
2. Login using:
    - Email - `texas.holdem.workshop@gmail.com`
    - Password - `texas shuffle`
2. Press `go to console`
