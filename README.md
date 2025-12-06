# DrinkSync

Check it out here: [DrinkSync](https://csci331vm.cs.montana.edu/~w62q346/finalproject/drink-sync/client/build)

Presentation:
https://docs.google.com/presentation/d/13tBiq7IYaSPkvgLTMxNoocOINSWaDUzl2gakcj9XnzU/edit?usp=sharing

## Overview

DrinkSync is a web app that lets users explore mixed drink recipes, receive random drink suggestions, search drinks by name, and save favorites for future reference.

## Features
Below is an overview of key features for each page in the web app.

### Main Drinks Page
* Random Drink Suggestion: on the main page, users will immediately be given a random set of recipes until they enter a search query.

* Infinite Scroll: the user will continuously be given new results as long as there are still results that match their query. If there is no query, the user will keep receiving random drinks from the CocktailDB API until the API itself runs out of recipes to serve.

* Recipe Filtering: users can filter search results by "All Drinks", "Alcoholic", and "Non-alcoholic" for their convenience.

### Drink Detail Page

A detailed display of the user's selected recipe.

This page is similar in structure to the drink card components that are displayed on the main Drinks page and the Saved Drinks page, but also includes the following:

* Preparation Instructions
* Buttons to save and remove the recipe from the user's Saved Drinks page.

### Saved Drinks Page

This page displays every drink recipe the user has saved.

Similar to the main drinks page, users can click the saved drink card and remove it from their Saved Drink page if desired.

### Persistent Navbar

Throughout the web app, a navigation bar stays fixed at the top of the screen and adjusts based on the current page.

### User Registration/Authentication

New users can register and later login to their own account so they can have their own unique Saved Drinks page.

### Guest View

If a new user doesn't want to register, they can choose to continue as a guest from the login page. 

The site is fully functional in guest mode, except that guests cannot save drinks to a personal collection.

## Tech Stack

Below is the tech stack we used to implement the DrinkSync web app.

### TheCocktailDB

This is the API that DrinkSync relies on for all mixed drink data. It includes useful data such as images, alcoholic flags, preparation instructions, and more!

You can check out TheCocktailDB API [here](https://www.thecocktaildb.com/api.php).

### Frontend

* React + the React Router library
* Typescript rather than JS to ensure type safety with external API response handling
* Custom CSS styling and animations

### Backend

DrinkSync's backend is powered by a LAMP (Linux, Apache, MySQL, PHP) stack and runs on Matthew Nagel's student VM, which itself is hosted on Montana State University's CSCI 331 course server. More specifically:

* Two tables are used in Matthew Nagel’s MariaDB database: one for user accounts and one for storing each user’s saved drink IDs (not full drink data).
* These tables are manipulated from our React frontend via PHP API endpoints whenever a user saves/removes a drink, creates a new account, etc.
* PHP scripting is also used for authentication whenever a user attempts to log in.

### Version Control

GitHub is used for all version control and collaborative development.

## Setup

Since DrinkSync relies on Matthew Nagel's MariaDB database (which only exists on the CSCI 331 course server), many features of this app (such as logging in and saving drinks) will unfortunately not be functional. However, if you'd like to attempt setting up just the frontend on your own machine, you can do so via the following commands:

```bash
git clone https://github.com/jordan-unzaga/DrinkSync.git
cd client
npm install #if you don't already have npm installed
npm start
```

## Group Members + Responsibilities

Below is a high-level breakdown of group responsibilities:

### Matthew Nagel

* Full-stack architecture
* PHP API development and backend logic
* Database design and setup
* Authentication and session management

### Jordan Unzaga

* UI design and CSS styling
* TheCocktailDB integration logic
* Frontend components and React application structure
* Guest vs. authenticated view logic

