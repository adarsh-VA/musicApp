<div align="center">
   <h1>Dotify</h1>
</div>

**Dotify**  is a Website which allows users to add songs, add artists and users can Rate the songs. Most important this website's home page has ability to show top 10 songs and top 10 artists according to their ratings and Well developed with Full `CRUD` operations.

# Getting Started :

## Tools Used 
- *Node.js / Express.js* - Backend Framework
- *MongoDB* - Database
- *Mongoose* - Database Connector
- *Bootstrap 5* - For Frontend design
- *EJS* - For embedding javascript in html
- *Passport* - For Authentication & Authorization
- *Multer* - For Image Upload
- *Flash* - For notification or alert messages.

## Installation

After downloading the Project you need to have Some packages installed to use this application and They are:

- **Node.js** - Download and Install Node.js : [Click Here](https://nodejs.org/en/download/)
- **MongoDB** - Download and Install MongoDB Community Server database : [Click Here](https://www.mongodb.com/try/download/community)
- (optional) **MongoDB Compass** - If you want to use GUI tool for mongoDB then Download : [Click Here](https://www.mongodb.com/try/download/compass)

## Setup

After Installation there are few steps to Run the application :

- **Run Server** - You need to type the command `npm install` in the main folder terminal which will install all the required packages for you.

- After installing packages you need to type the command `node index.js` to run the server and a message will be displayed in the console log like below.
```
server started
connection open
```
- And now open your browser and enter `http://localhost:3000/home` url where the Webpage will be displayed. And hence it is the starting stage you don't have any artists or songs in the database, So webpage will not display any songs or artists.

## Adding Data

- Now this is the time to create an artist or a song but you need to register first and then you can add songs or artists manually. 
- If you don't want to add them manually then i have created a program which system will create 20 Users and 15 Artists for you.
- **Auto add Users** run the file called "userseeds.js" by the command `node userseeds.js` this will create 20 users with usernames `user1,user2,user3 ...user20` with password `123` for all users and don't stop the program until it shows the message like below.
```
connection open
completed
```
- **Auto add Artists** run the file called "artistseeds.js" by the command `node artistseeds.js` this will create 15 random artists with image but "image field is optional" and don't stop the program until it shows the message like below.
```
connection open
completed
```
## Demo

- **Home Page** shows top 10 songs where user can rate song Note:"User can rate only if he is logged in".

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/home1.jpg" />

---

- **Top 10 Artists** they are rated based on their song ratings.

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/home2.jpg" />

---

- **All Songs Page** to display all the available Songs.

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/allsongs.jpg" />

---

- **All Artists Page** to display all the available Artists.

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/allartists.jpg" />

---

- **Login Page**

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/login.jpg" />

---

- **Register Page** 

<img alt="Logo" src="https://github.com/adarsh-VA/dotify/blob/main/demo/register.jpg" />


 
