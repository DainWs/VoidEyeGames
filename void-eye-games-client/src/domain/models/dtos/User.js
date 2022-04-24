import { ACCOUNT_TYPE_UNKNOWN, getTypeFromName } from "../AccountTypes";

class User {
    constructor(builder = {id: -1, name: null, password: null, email: null, imageUrl: null, publicityAccepted: false, accountType: ACCOUNT_TYPE_UNKNOWN.getName(), comments: []}) {
        this.id = builder.id;
        this.name = builder.name;
        this.password = builder.password;
        this.email = builder.email;
        this.imageUrl = builder.imageUrl;
        this.publicityAccepted = builder.publicityAccepted;
        this.accountType = getTypeFromName(builder.accountType);
        this.comments = builder.comments;
    }
    
    canPerforme(userAction) {
        return userAction.canBePerformedBy(this);
    }

    hasComment(id) {
        return (this.comments[id] !== undefined);
    }

    getComment(id) {
        return this.comments[id];
    }
}

export default User;