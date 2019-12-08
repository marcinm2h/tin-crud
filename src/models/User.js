let nextId = 0;

class User {
  constructor({
    id = nextId++,
    login,
    mail,
    userName,
    name,
    gender,
    registerDate = Date.now(),
    comments = [],
    posts = [],
    groupsIn = [],
    groupsCreated = [],
  }) {
    this.id = id;
    this.login = login;
    this.password = this.password;
    this.userName = userName;
    this.mail = mail;
    this.name = name;
    this.gender = gender;
    this.registerDate = registerDate; // TODO: timestamp -> Date

    this.comments = comments;
    this.posts = posts;
    this.groupsIn = groupsIn;
    this.groupsCreated = groupsCreated;
  }
}

module.exports = { User };
