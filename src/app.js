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

// const { Admin } = require

db.serialize(() => {
  // db.each('SELECT * FROM Admin', (err, row) => {
  //   console.log(row);
  // });
  const serializeValue = value => {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = `${value.getMonth() + 1}`.padStart(2, '0');
      const day = `${value.getDate()}`.padStart(2, '0');
      const hours = `${value.getHours()}`.padStart(2, '0');
      const minutes = `${value.getMinutes()}`.padStart(2, '0');
      const seconds = `${value.getSeconds()}`.padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return value;
  };

  const insert = (model, values) => `INSERT INTO "${model}" (
    ${Object.keys(values)
      .map(key => `"${key}"`)
      .join(',')}
  ) VALUES (
    ${Object.values(values)
      .map(val => `"${serializeValue(val)}"`)
      .join(',')}
  );`;

  db.run(
    insert('Admin', {
      login: 'admin3',
      mail: 'admin2@example.com',
      name: 'Janusz',
      gender: true,
      registerDate: new Date(),
      password: 'test',
    }),
    err => {
      console.log(err);
    },
  );

  const remove = (model, id) => `
  DELETE FROM ${model} where id=${id} ;
`;

  db.run(remove('Admin', 1), (err, row) => {
    console.log(err, row);
  });

  const details = (model, id) => `
  SELECT * FROM ${model} WHERE id=${id};
`;

  console.log(details('Admin', 1));

  db.get(details('Admin', 1), (error, row) => {
    console.log(error, row);
  });

  const update = (model, id, values) => `UPDATE "${model}"
  SET ${Object.entries(values)
    .map(([key, val]) => `"${key}" = "${serializeValue(val)}"`)
    .join(',')}
  WHERE id=${id};
`;

  console.log(update('Admin', 1, { login: 'test' }));

  db.run(update('Admin', 2, { login: 'test' }), (err, row) => {
    console.log(err, row);
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
