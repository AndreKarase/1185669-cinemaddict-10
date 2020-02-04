export default class Comment {
  constructor(comment) {
    this.id = comment[`id`] || null;
    this.name = comment[`author`] || null;
    this.text = comment[`comment`];
    this.time = new Date(comment[`date`]);
    this.emoji = comment[`emotion`];
  }

  toRaw() {
    return {
      'comment': this.text || ``,
      'date': this.time.toISOString(),
      'emotion': this.emoji
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comment) {
    return comment.map(Comment.parseComment);
  }
}
