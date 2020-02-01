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

const db = require('./services/database');

db.query(() => {
  db.insert('Admin', {
    login: 'admin3__XD',
    mail: 'admin2@example.com',
    name: 'Janusz',
    gender: true,
    registerDate: new Date(),
    password: 'test',
  })
    .then(result => {
      console.log('insert', { result }); // no return in any case
    })
    .catch(error => {
      console.log({ error });
    });

  db.remove('Admin', 2)
    .then(row => {
      console.log('remove', { row }); // no return in any case
    })
    .catch(error => {
      console.log({ error });
    });

  db.details('Admin', 3)
    .then(row => {
      console.log('details', { row });
    })
    .catch(error => {
      console.log({ error });
    });

  db.update('Admin', 30, { login: 'nowy_login' })
    .then(row => {
      console.log('list', { row }); // no return in any case
    })
    .catch(error => {
      console.log({ error });
    });

  db.list('Admin')
    .then(row => {
      console.log('list', { row });
    })
    .catch(error => {
      console.log({ error });
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
