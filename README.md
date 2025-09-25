# Tic-Tac-Toe

The below problems are to allow us a glimpse into your problem solving ability, style and current skill set. We expect this test to take 2-3 hours, if you find yourself spending more than this do not aim to solve all 3 problems!

## Problems

### Problem 1

We have started a basic game of Tic-Tac-Toe as outlined [here](https://en.wikipedia.org/wiki/Tic-tac-toe) but we don't have anyone good enough to code to finish it!

- Please implement a complete basic game of Tic-Tac-Toe
- Please use React and TypeScript throughout, if you know TailwindCSS please expand on what is already provided, otherwise it is fine to use raw styling
- Both players will play out of the same application, it is sufficient to just switch the current player each time a move is played
- Once a game is completed, I should be able to start another game

### Problem 2

We are bored with the basic game now, can you make it so the board can be scaled to any size?

- Add some kind of input which allows me to change the board size
- The board size should be a number between 3 and 15

### Problem 3

We want to store game results in a database.

- Create a simple backend server
- Use any SQL database to store the results, please structure it in a relational manner and in a way for it to be expanded for future use cases
- Display simple stats back to the user including number of win and losses for each player

## Docker

- Make sure docker engine is running
- `docker-compose up --build`
- Visit app at http://localhost:3000/

## From source

### Frontend

- Make sure you have **node** installed
- `cd client`
- `npm i`
- `npm start`

### Backend

- `cd backend`
- `python -m venv venv`
- `venv\Scripts\activate`
- `pip install -r requirements.txt`
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py runserver`
