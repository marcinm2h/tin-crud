let nextId = 0;

class Comment {
  constructor({
    id = nextId++,
    content,
    votesFor = 0,
    votesAgainst = 0,
    isHidden = false,
    creationDate = Date.now(),
  }) {
    this.id = id;
    this.content = content;
    this.votesFor = votesFor;
    this.votesAgainst = votesAgainst;
    this.isHidden = isHidden;
    this.creationDate = creationDate; // timestamp -> Date
  }
}

module.exports = { Comment };
