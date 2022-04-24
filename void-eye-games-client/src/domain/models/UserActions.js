import { ACCOUNT_TYPE_ADMIN, ACCOUNT_TYPE_UNKNOWN } from "./AccountTypes";

class UserActions {
    constructor(id, condition) {
        this.id = id;
        this.condition = condition;
    }

    canBePerformedBy(user) {
        return this.condition(user);
    }
}

const USER_ACTION_LOG_IN = new UserActions(0, (user) => (user.accountType === ACCOUNT_TYPE_UNKNOWN) );
const USER_ACTION_SIGN_IN = new UserActions(1, (user) => (user.accountType === ACCOUNT_TYPE_UNKNOWN) );
const USER_ACTION_SIGN_OUT = new UserActions(2, (user) => (user.accountType !== ACCOUNT_TYPE_UNKNOWN) );
const USER_ACTION_COMMENT = new UserActions(3, (user) => (user.accountType !== ACCOUNT_TYPE_UNKNOWN) );
const USER_ACTION_SEND_REPORT = new UserActions(4, (user) => (user.accountType !== ACCOUNT_TYPE_UNKNOWN) );

const USER_ACTION_ADMIN_ACTION = new UserActions(5, (user) => (user.accountType === ACCOUNT_TYPE_ADMIN) );

export {USER_ACTION_LOG_IN, USER_ACTION_SIGN_IN, USER_ACTION_SIGN_OUT, USER_ACTION_COMMENT, USER_ACTION_SEND_REPORT, USER_ACTION_ADMIN_ACTION};

const USER_ACTIONS = new Map();
USER_ACTIONS.set(USER_ACTION_LOG_IN.id, USER_ACTION_LOG_IN);
USER_ACTIONS.set(USER_ACTION_SIGN_IN.id, USER_ACTION_SIGN_IN);
USER_ACTIONS.set(USER_ACTION_SIGN_OUT.id, USER_ACTION_SIGN_OUT);
USER_ACTIONS.set(USER_ACTION_COMMENT.id, USER_ACTION_COMMENT);
USER_ACTIONS.set(USER_ACTION_SEND_REPORT.id, USER_ACTION_SEND_REPORT);
USER_ACTIONS.set(USER_ACTION_ADMIN_ACTION.id, USER_ACTION_ADMIN_ACTION);

export function get(id) {
    return USER_ACTIONS.get(id);
}