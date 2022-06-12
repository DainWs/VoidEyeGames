/**
 * File: Comment.js
 * Purpose: The model representation of a Comment object.
 * DB Access: No
 * Used from:
 *  - Game.js
 * Uses files:
 *  - None
 */
class Comment {
    constructor(builder = {id: -1, usersId: -1, gamesId: -1, description: '', user: null, game: null}) {
        this.id = builder.id;
        this.usersId = builder.usersId;
        this.gamesId = builder.gamesId;
        this.description = builder.description;
        this.user = builder.user;
        this.game = builder.game;
    }
}
export default Comment;