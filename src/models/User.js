class User {
  static nextId = 0;
  id;
  login;
  mail;
  constructor({ id = User.nextId++, login, mail }) {
    this.id = id;
    this.login = login;
    this.mail = mail;
  }
}

module.exports = { User };
