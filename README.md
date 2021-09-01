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
- For backend application, just clone the repo https://github.com/MenAllen/PhilippeJoubard_6_30032021.git, launch npm install and npm start


## General Description
PIIQUANTE is dedicated to hot sauces creation, whose recipes are kept secrete. To inrease buzz, the company
wants to create a web application where users can add their preferred own sauces, and like or dislike sauces added by others

## Tools & Software used for backend
- Visual Studio Code with extensions Prettier & Live Server
- Git & Github
- Runtime NodeJS, Express
- MongoDB, mongoose
- Languages: HTML, CSS, Javascript

## Additinal functions

- A badge is made available on each page to update the user with the number of articles in the basket
- When a request is sent to server, a spinner is activated to show the front-end app is running and requesting answer from server
- When an error message is received from server, an alert panel (red) is displayed with the error code received
_ The order page lists the products ordered =, their quantity and the sub-total price

## Improvments & suggested add-ons
- Adding quantity info for each product in the product order data would simplify and fluidify the exchange between front and backend
- Some images on server side need to be compressed: for example, oak_5.jpg is 4712Ko