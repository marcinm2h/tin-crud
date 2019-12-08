let nextId = 0;

class Post {
  constructor({
    id = nextId++,
    url,
    votesFor = 0,
    votesAgainst = 0,
    desctiption,
    creationDate = Date.now(),
  }) {
    this.id = id;
    this.url = url;
    this.votesFor = votesFor;
    this.votesAgainst = votesAgainst;
    this.desctiption = desctiption;
    this.creationDate = creationDate; // timestamp -> Date
  }
}

module.exports = { Post };
