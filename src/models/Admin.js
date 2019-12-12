let nextId = 0;

class Admin {
  constructor({
    id = nextId++,
    login,
    password,
    mail,
    name,
    gender,
    registerDate = Date.now(),
  }) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.mail = mail;
    this.name = name;
    this.gender = gender;
    this.registerDate = registerDate; // TODO: timestamp -> Date
  }
}

module.exports = { Admin };
