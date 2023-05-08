const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { maxHeaderSize } = require('http');

const ExpressApp = express();

ExpressApp.use(bodyParser.urlencoded({ extended: true }));
ExpressApp.use(express.static(path.join(__dirname, 'src')));


ExpressApp.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'electron',
});


ExpressApp.get('/', function (req, res) {
    res.sendFile(path.join(__dirname , 'src' , 'home.html'));
  });
  
ExpressApp.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname , 'src' , 'signup.html'));
  });
  
  ExpressApp.post('/signup', function (req, res) {
    const { username, email, password } = req.body;
    if (username && email && password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          res.redirect('/signup');
        } 
        else {
          const sql =
            'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
          connection.query(sql, [ email, hash, username], (err, result) => {
            if (err) {
              console.log(err);
              res.redirect('/signup');
            } else {
              console.log(result);
              req.session.loggedin = true;

              req.session.username = username;
              res.redirect('/');
            }
          });
        }
      });
    } else {
      res.redirect('/signup');
    }
  });


ExpressApp.get('/login', function (req, res) {
  
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
    
  });
  
  

ExpressApp.post('/login', function (req, res) {
    const { username, password } = req.body;
    if (username && password) {
      const sql = 'SELECT * FROM users WHERE username = ?';
      connection.query(sql, [username], (err, result) => {
        if (err) {
          console.log(err);
          res.redirect('/login');
        } else if (result.length === 1) {
          bcrypt.compare(
            password,
            result[0].password,
            (err, bcryptRes) => {
              if (bcryptRes) {
                req.session.loggedin = true;
                req.session.username = username;
                
                res.redirect('/home');
              } else {
                res.redirect('/login');
              }
            }
            );
          } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login');
    }
  });

ExpressApp.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'project.html'));
});

ExpressApp.get('/newrecord', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'newrecord.html'));
});

ExpressApp.post('/newrecord', function (req, res) {
    const { date, title, content } = req.body;
    const username = req.session.username;
  
    if (!username) {
      console.log('No username found in session');
      res.redirect('/home');
      return;
    }
  
    const sql = 'SELECT userid FROM users WHERE username = ?';
    connection.query(sql, [username], (err, userids) => {
      if (err) {
        console.log(err);
        res.redirect('/home');
        return;
      }
      
      const userid = userids[0].userid;
  
      if (date && title && content) {    
        const sql = 'INSERT INTO diary (userid, date, titile, content) VALUES (?, ?, ?, ?)';
        connection.query(sql, [userid, date, title, content], (err, result) => {
          if (err) {
            console.log(err);
            res.redirect('/home');
          } else {
            console.log(result);
            res.redirect('/home');
          }
        });
      } else {
        res.redirect('/home');
      }
    });
  });
  


ExpressApp.get('/previousrecord', function (req, res) {
  res.sendFile(path.join(__dirname, 'src', 'previousrecord.html'));
});

ExpressApp.post('/previousrecord', function (req, res) {
  const { date } = req.body;
  if (date) {
    console.log(`Session date set to ${date}`);
    req.session.date = date;
    res.redirect('/diary');
  } else {
    console.log(`No date found in request body`);
    res.redirect('/previousrecord');
  }
});

ExpressApp.get('/diary', function (req, res) {
    const date = req.session.date;
    const username = req.session.username;
    
    if (!username) {
      console.log('No username found in session');
      res.redirect('/');
      return;
    }
    
    const sql = 'SELECT userid FROM users WHERE username = ?';
    connection.query(sql, [username], (err, userids) => {
      if (err) {
        console.log(err);
        res.redirect('/');
        return;
      }
      
      if (!date) {
        console.log(`No session date found`);
        res.redirect('/previousrecord');
        return;
      }
      
      const sql = 'SELECT diary.titile, diary.content FROM diary JOIN users ON diary.userid=users.userid WHERE diary.date = ? AND users.username = ?';
      connection.query(sql, [date, username], (err, results) => {
        if (err) {
        console.log(err);
        res.redirect('/home');
        return;
        }

        console.log(`Query results for ${date}: ${JSON.stringify(results)}`);

        if (results.length === 0) {
          res.send(`
          <html>
            <head>
              <title>No Diary Entry Found</title>
            </head>
            <body>
              <h1>No Diary Entry Found</h1>
            </body>
          </html>
        ` );
          return;
        }

        const { titile, content } = results[0];

        res.send(`
          <html>
            <head>
              <title>${titile}</title>
              <link rel="stylesheet" type="text/css" href="newrecord.css">
            </head>
            <body>
              <h1>${titile}</h1>
              <p>${content}</p>
            </body>
          </html>
      ` );
      });

      /*
      const sql = 'SELECT titile, content FROM diary, users WHERE diary.userid=users.userid and date = ?';
      const userid = userids[0].userid;
      connection.query(sql, [date], (err, results) => {
        if (err) {
          console.log(err);
          res.redirect('/home');
          return;
        }
        
        console.log(`Query results for ${date}: ${JSON.stringify(results)}`);
        const { titile, content } = results[0];
  
        res.send(`
          <html>
            <head>
              <title>${titile}</title>
              <link rel="stylesheet" type="text/css" href="newrecord.css">
            </head>
            <body>
              <h1>${titile}</h1>
              <p>${content}</p>
            </body>
          </html>
        `);
      });*/
    });
  });
  


const url = require('url');
const port = 5000;
let mainWindow;

ExpressApp.get('/home', (req, res) => {
  res.send('Hello from Express!');
});

ExpressApp.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

