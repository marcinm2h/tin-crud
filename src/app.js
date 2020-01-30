const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const {
  PORT,
  SESSION_SECRET,
  SESSION_NAME,
  SESSION_MAX_AGE,
} = require('./env');
const { routes } = require('./routes');
const { errorHandler } = require('./errorHandler');
const { requestLogger } = require('./requestLogger');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.serialize(() => {
  db.each('SELECT * FROM Admin', (err, row) => {
    console.log(row);
  });
});

db.close();

const app = express();

app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false, // FIXME: httpOnly -> save on first req
      maxAge: SESSION_MAX_AGE,
      sameSite: true,
      sexure: false,
    },
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger());
app.use(routes);
app.use(errorHandler());

app.listen(PORT);

console.log(`Server is running at ${PORT}`);
