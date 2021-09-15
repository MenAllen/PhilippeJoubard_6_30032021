# PhilippeJoubard_6_30032021
Sixth project of web development course at OpenClassrooms:  "Construisez une API securisée pour une application d'avis gastronomiques"
Goal, as a backend developer working for PIIQUANTE company, is to develop an API for backend application.
A specifications document for te API is available.

## !! IMPORTANT !!
- This repo only includes backend application
- Frontend application is available from following github repository: 

			https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6
			This is the frontend application for Project sixt of the Junior Web Developer path.
			Installation: Here are the dependancies you need to install:
				NodeJS 12.14 or 14.0.
				Angular CLI 7.0.2.
				node-sass : make sure to use the corresponding version to NodeJS. For Node 14.0 for instance, you need node-sass in version 4.14+.
				On Windows, these installations require to use PowerShell in administrator mode.
			Then, clone this repo and run npm install.
			Usage
				Run npm start. This should both run the local server and launch your browser.
			If your browser fails to launch, or shows a 404 error, navigate your browser to http://localhost:8080.
				The app should reload automatically when you make a change to a file.
				Use Ctrl+C in the terminal to stop the local server.

- For backend application:
		clone the repo https://github.com/MenAllen/PhilippeJoubard_6_30032021.git,
		edit .env file to fill in DB & TOKEN with relevant strings:
			DB: the process.env.DB string is used in app.js for connection with the MongoDB used.Example:
				"mongodb+srv://<user>:<password>@cluster0.q0wyp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
			TOKEN: the process.env.TOKEN string is used in users.js and auth.js. Example:
				"MY_SECRET_TOKEN"
			Note DB & TOKEN strings used for dev can be requested through mail to philippe.joubard@sfr.fr,and a secure transfer initiated
		launch "npm install" then "node server". Note on startup a console message will indicate whether the connexion to db succeeded or not
		Note Password must be at least 8 chars, with at least one capital letter (A-Z), one small letter (a-z) and one number (0-9)

## General Description
PIIQUANTE is dedicated to hot sauces creation, whose recipes are kept secrete. To inrease buzz, the company
wants to create a web application where users can add their preferred own sauces, and like or dislike sauces added by others

## Tools & Software used for backend
- Visual Studio Code with extensions Prettier & Live Server
- Git & Github
- Runtime NodeJS, Express
- MongoDB, mongoose
- Languages: HTML, CSS, Javascript

## Additional functions
- jsonwebtoken to generate and decode token
- brcrypt used to hash password
- helmet to prevent security issues with HTML headers
- express-mongo-sanitize to prevent injection attacks in mongoDB