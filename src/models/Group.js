let nextId = 0;

class Group {
  constructor({
    id = nextId++,
    name,
    desctiption,
    tag,
    isHidden = false,
    creationDate = Date.now(),
  }) {
    this.id = id;
    this.name = name;
    this.desctiption = desctiption;
    this.tag = tag;
    this.isHidden = isHidden;
    this.creationDate = creationDate; // timestamp -> Date
  }
}

module.exports = { Group };
