#PROJECT 03
##Drawing.io 
Real time drawing with friends/pictionary game with friends

Heroku link: http://fathomless-oasis-85228.herokuapp.com/

Express Node.js App

###Functionality: 
- Able to draw real time with other users
- Chat with other users
- Play online Pictionary game

###Setup:

- use express with node.js
- use socket.io for real time interaction
- set up routes that point to right view pages
- OAtuh user log in
- using paper.js for drawing canvas

##Usage 

**Users:**

- should be able to draw only on their turn
- should be able to enter a room
- should be able to see who is connected in the room
- should be able to see who scored
- should be able to start/end the game

##Game and Server

**Server:**

- the server should hold all the players who entered a nickname or logged in
- also be able to remove a player when a user exits the web page
- the server will keep track of player turns
- the server will also keep track of the score
- display the word to the right user
- give permission to draw on the board for the right user

**Game:**

- set an array of words 
- randomly select a word for the game
- check if user inputs match the word in the array
- add points to the right guesses
- select a winner with the highest score
- game ends after certain amount of points
- timer on each round

