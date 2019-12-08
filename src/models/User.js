let nextId = 0;

class User {
  constructor({ id = nextId++, login, mail }) {
    this.id = id;
    this.login = login;
    this.mail = mail;
  }
}

module.exports = { User };
