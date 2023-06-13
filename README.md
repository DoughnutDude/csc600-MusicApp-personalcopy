# DoughnutDude's personal copy of csc600, team KNCZ's music app
This project had us grapple with a React based music app for our Programming Languages and Paradigms class as a way of becoming familiar with Functional Programming concepts implemented in a relatively large program. We were required to create new instruments, new audio visualizers, and new features for the song database.

Since the project made heavy use of Tone.js, I made a simple rectangular slider as my instrument, with the vertical axis representing volume, and horizontal representing frequency, with some additional effect filters that could be toggled to further change the sound.

I also made changes to the song playing mechanism. The original was only able to play songs with quarter notes, which I modified to support Tone.js's full range of note subdivisions.

| [Video Demo Link](https://www.youtube.com/watch?v=gca9xS5r61I&ab_channel=CameronYee)|
|:---:|

Original Project Description/Details in [FINAL_PROJECT.md](/FINAL_PROJECT.md) and below:


#


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/yXIQAqiF)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10780705&assignment_repo_type=AssignmentRepo)
# LamdbaVibe

CSC 600 musical application. Get ready to shred.

## Client

The client contains the code which you will modify as part of the course. It constitutes the frontend (UI) portion of this web application.

In the `client` directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run prod`

This is a combination of `npm run build` and python3 `http.server`. This will start a new web server that hosts your app at [http://localhost:3002](http://localhost:3002). Rather than talking to your local environment, it will talk to a live, production server so you can jam with your group.

### Learn More about CRA (Create React App)

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Server

The server contains the backend code which is included here as a reference and as a pedagogical tool. Peruse the code to figure out how it works and how you ought to call the API. You will run a version of the server locally for testing purposes. Once you're ready to jam with your classmates, you will switch to talking to a production server. See `npm run prod` for details.

In the `server` directory, you can run:

### `npm start`

Runs the server in development mode.

The server will restart if you make edits.
You will also see errors in the console.
