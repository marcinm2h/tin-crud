let nextId = 0;

class User {
  constructor({
    id = nextId++,
    login,
    password,
    mail,
    name,
    gender,
    registerDate = Date.now(),
    comments = [],
    posts = [],
    groups = [],
  }) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.mail = mail;
    this.name = name;
    this.gender = gender;
    this.registerDate = registerDate;

    this.comments = comments;
    this.posts = posts;
    this.groups = groups;
  }
}

module.exports = { User };
