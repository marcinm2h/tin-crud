let nextId = 0;

class Post {
  constructor({
    id = nextId++,
    url,
    votesFor = 0,
    votesAgainst = 0,
    description,
    creationDate = Date.now(),
    comments = [],
    group,
    author,
  }) {
    this.id = id;
    this.url = url;
    this.votesFor = votesFor;
    this.votesAgainst = votesAgainst;
    this.description = description;
    this.creationDate = creationDate; // TODO: timestamp -> Date

    this.comments = comments;
    this.group = group;
    this.author = author;
  }
}

module.exports = { Post };
