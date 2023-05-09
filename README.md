# Electron-Tinkerhub-SaturdayHacknight
![Electron Notion](https://user-images.githubusercontent.com/64391274/235363274-375ce61c-721f-4543-a150-1b99525d54ac.png)


# Personal Diary
This Project has brought to life an application made using ElectronJs which helps us write Our Personal Diary Writeups easily.🤩🤩

Multiple Accounts can be used on the same machine to allow access to multiple users.😲

It Comes With Hashed passwords so no one can peep into your Diaries.😏😏
 
## Team members
1. [Ghanashyam](https://github.com/Ghanashyam03)
2. [Harishankar](https://github.com/H4rish4nk4r)
3. [Viraj](https://github.com/viraka)

## Link to product walkthrough
[link to video]

## How it Works ?
The project involves using HTML,CSS and JavaScript as well as a MySQL Database on the Host Computer to Bring to Life this Diary App.

Nodejs And ExpressJs Helps us set up localhost on port 5000 and is also used to handle Requests(In One JavaScript File- index.js).

Another Javascript File is used for the Electron Window (main.js) connected to the localhost port.

## Libraries used
Express-4.18.2

MySQL-8.0

Node-18.16.0

Body-parser - 1.20.2

Bcrypt-5.1.0

## How to configure
Install the prerequisites such as node, express, sql2, electron & MySQL DBMS .

In MySQL create a database called "**electron**" in which you would want to create two tables **users** and **diary** using:
```
create table users(userid int AUTO_INCREMENT PRIMARYKEY,email varchar(2000),password varchar(2000),username varchar(1000));
create table diary(userid int ,date date, titile varchar(2000),content varchar(2000)); 
```
>sorry for the spelling mistakes.. too far gone to correct them now :')...

Host the index.js file by using:
```
node index.js
```
in the command prompt after you move the current directory to where you have downloaded the project

## How to Run
Nothing much left really.. Use:
```
npm start
```
in the command prompt at the project directory and you should have your app Open and Ready to Go.
