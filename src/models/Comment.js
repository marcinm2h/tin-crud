let nextId = 0;

class Comment {
  constructor({
    id = nextId++,
    content,
    votesFor = 0,
    votesAgainst = 0,
    isHidden = false,
    creationDate = Date.now(),
    author,
    post,
  }) {
    this.id = id;
    this.content = content;
    this.votesFor = votesFor;
    this.votesAgainst = votesAgainst;
    this.isHidden = isHidden;
    this.creationDate = creationDate; // TODO: timestamp -> Date

    this.author;
    this.post;
  }
}

module.exports = { Comment };
