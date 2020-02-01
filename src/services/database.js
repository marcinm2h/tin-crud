const { __DEV__, DB_PATH } = require('../env');
const sqlite3 = require('sqlite3').verbose();

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

const parseBool = value => Boolean(value);

const parseDate = value => new Date(value);

const mapModel = modelName =>
  ({
    User: 'Logged',
  }[modelName] || modelName); // FIXME: move to model definition

const parseModelName = model =>
  mapModel(typeof model === 'string' ? model : model.name);

const insert = (model, values) => `INSERT INTO ""${parseModelName(model)}"" (
  ${Object.keys(values)
    .map(key => `"${key}"`)
    .join(',')}
) VALUES (
  ${Object.values(values)
    .map(val => `"${serializeValue(val)}"`)
    .join(',')}
);`;

const update = (model, id, { id: _, ...values }) => `UPDATE "${parseModelName(
  model,
)}"
SET ${Object.entries(values)
  .map(([key, val]) => `"${key}" = "${serializeValue(val)}"`)
  .join(',')}
WHERE id=${id};
`;

const remove = (model, id) => `
DELETE FROM "${parseModelName(model)}" where id=${id} ;
`;

const list = model => `
SELECT * FROM "${parseModelName(model)}"
`;

const details = (model, id) => `
SELECT * FROM "${parseModelName(model)}" WHERE id=${id};
`;

const find = (model, field) => `
SELECT * FROM "${parseModelName(model)}" WHERE
${Object.entries(field)
  .map(([key, value]) => `${key} = "${value}"`)
  .join(' AND ')};
`;

class DbService {
  constructor() {
    this.__instance = new sqlite3.Database(DB_PATH);
  }

  serialize(fn) {
    this.__instance.serialize(fn);
  }

  close() {
    this.__instance.close();
  }

  add(...args) {
    const query = insert(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.run(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  edit(...args) {
    const query = update(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.run(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  remove(...args) {
    const query = remove(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.run(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  list(...args) {
    const query = list(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.all(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  details(...args) {
    const query = details(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.get(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  find(...args) {
    const query = find(...args);
    if (__DEV__) {
      console.log(query);
    }
    return new Promise((resolve, reject) => {
      this.__instance.get(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}

module.exports = {
  DbService,
  parseBool,
  parseDate,
};
