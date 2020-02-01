const { DB_PATH } = require('../env');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(DB_PATH);

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

const update = (model, id, { id, ...values }) => `UPDATE "${model}"
SET ${Object.entries(values)
  .map(([key, val]) => `"${key}" = "${serializeValue(val)}"`)
  .join(',')}
WHERE id=${id};
`;

const remove = (model, id) => `
DELETE FROM ${model} where id=${id} ;
`;

const list = model => `
SELECT * FROM ${model}
`;

const details = (model, id) => `
SELECT * FROM ${model} WHERE id=${id};
`;

module.exports = {
  __db: db,
  query: (...args) => db.serialize(...args),
  close: (...args) => db.close(...args),
  insert: (...args) =>
    new Promise((resolve, reject) => {
      db.run(insert(...args), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }),
  update: (...args) =>
    new Promise((resolve, reject) => {
      db.run(update(...args), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }),
  remove: (...args) =>
    new Promise((resolve, reject) => {
      db.run(remove(...args), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }),
  list: (...args) =>
    new Promise((resolve, reject) => {
      db.all(list(...args), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }),
  details: (...args) =>
    new Promise((resolve, reject) => {
      db.get(details(...args), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }),
};
