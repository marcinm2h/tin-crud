let nextId = 0;

class Admin {
  constructor({
    id = nextId++,
    login,
    mail,
    name,
    gender,
    registerDate = Date.now(),
  }) {
    this.id = id;
    this.login = login;
    this.password = this.password;
    this.mail = mail;
    this.name = name;
    this.gender = gender;
    this.registerDate = registerDate; // TODO: timestamp -> Date
  }
}

module.exports = { Admin };
