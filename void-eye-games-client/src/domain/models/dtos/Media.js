class Media {
    constructor(builder = {id: -1, gamesId: -1, mediaType: null}) {
        this.id = builder.id;
        this.gamesId = builder.gamesId;
        this.mediaType = builder.mediaType;
    }
    
    getMediaSource() {
        let ext = this.mediaType.substr(this.mediaType.indexOf('/'));
        return `assets/images/games/medias/${this.gamesId}-${this.id}.${ext}`;
    }
}