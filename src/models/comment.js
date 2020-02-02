export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`author`];
    this.text = data[`comment`];
    this.time = new Date(data[`date`]);
    this.emoji = data[`emotion`];
  }

  toRaw() {
    return {
      'id': this.id,
      'author': this.name,
      'comment': this.text,
      'date': this.time.toISOString,
      'emotion': this.emoji
    }
  }

  static parseComment(data) {
    return new Comment(data)
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
