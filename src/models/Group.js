let nextId = 0;

class Group {
  constructor({
    id = nextId++,
    name,
    desctiption,
    tag,
    isHidden = false,
    creationDate = Date.now(),
    posts = [],
    owner,
    users = [],
  }) {
    this.id = id;
    this.name = name;
    this.desctiption = desctiption;
    this.tag = tag;
    this.isHidden = isHidden;
    this.creationDate = creationDate; // TODO: timestamp -> Date

    this.posts = posts;
    this.owner = owner;
    this.users = [];
  }
}

module.exports = { Group };
