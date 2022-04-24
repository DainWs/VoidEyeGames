class AccountType {
    constructor(id, name) {
        this.id = id;
        this.name = name;   
    }
    
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
}

const ACCOUNT_TYPE_ADMIN = new AccountType(0, 'Admin');
const ACCOUNT_TYPE_USER = new AccountType(1, 'User');
const ACCOUNT_TYPE_UNKNOWN = new AccountType(2, 'Unknown');

export {ACCOUNT_TYPE_ADMIN, ACCOUNT_TYPE_USER, ACCOUNT_TYPE_UNKNOWN};

const ACCOUNT_TYPES = new Map();
ACCOUNT_TYPES.set(ACCOUNT_TYPE_ADMIN.getName(), ACCOUNT_TYPE_ADMIN);
ACCOUNT_TYPES.set(ACCOUNT_TYPE_USER.getName(), ACCOUNT_TYPE_USER);
ACCOUNT_TYPES.set(ACCOUNT_TYPE_UNKNOWN.getName(), ACCOUNT_TYPE_UNKNOWN);

export function getTypeFromName(name) {
    if (!ACCOUNT_TYPES.has(name)) {
        return ACCOUNT_TYPE_UNKNOWN;
    }
    return ACCOUNT_TYPES.get(name);
}