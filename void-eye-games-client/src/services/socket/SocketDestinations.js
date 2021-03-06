/**
 * File: SocketDestinations.js
 * Purpose: This enumerator is used to declare all allowed API Paths destinations.
 * DB Access: No
 * Used from:
 *  - HealthDialogComponent.js
 *  - GameDetailsPage.js
 *  - GamePage.js
 *  - HomePage.js
 *  - LogInFormPage.js
 *  - ReportFormPage.js
 *  - SignInFormPage.js
 *  - CategoryFormPage.js
 *  - GameFormPage.js
 *  - PlataformFormPage.js
 * Uses files:
 *  - None
 */
const DESTINATION_HEALTH = '/health';

const DESTINATION_GAMES = '/game';
const DESTINATION_GAMES_UPDATE = '/game/update';

const DESTINATION_PLATAFORM_GAMES = '/games';
const DESTINATION_LIST_OF_GAMES = '/games/listed';

const DESTINATION_CATEGORY = '/category';
const DESTINATION_CATEGORIES_UPDATES = '/category/update';

const DESTINATION_CATEGORIES = '/categories';
const DESTINATION_LIST_OF_CATEGORIES = '/categories/listed';

const DESTINATION_PLATAFORM = '/plataform';
const DESTINATION_PLATAFORMS_UPDATES = '/plataform/update';

const DESTINATION_PLATAFORMS = '/plataforms';
const DESTINATION_LIST_OF_PLATAFORMS = '/plataforms/listed';

const DESTINATION_COMMENT = '/comment';
const DESTINATION_LOGIN = '/logIn';
const DESTINATION_SIGNIN = '/signIn';
const DESTINATION_REPORT = '/report';
const DESTINATION_RECOVERY = '/recovery';

export {
    DESTINATION_HEALTH,

    DESTINATION_GAMES,
    DESTINATION_GAMES_UPDATE,
    DESTINATION_LIST_OF_GAMES,
    DESTINATION_PLATAFORM_GAMES, 

    DESTINATION_CATEGORY,
    DESTINATION_CATEGORIES, 
    DESTINATION_CATEGORIES_UPDATES,
    DESTINATION_LIST_OF_CATEGORIES,

    DESTINATION_PLATAFORM,
    DESTINATION_PLATAFORMS,
    DESTINATION_LIST_OF_PLATAFORMS,
    DESTINATION_PLATAFORMS_UPDATES,

    DESTINATION_COMMENT,
    DESTINATION_LOGIN,
    DESTINATION_SIGNIN,
    DESTINATION_REPORT,
    DESTINATION_RECOVERY
};

export const ALL_DESTINATIONS = [
    DESTINATION_HEALTH,

    DESTINATION_GAMES, 
    DESTINATION_GAMES_UPDATE,
    DESTINATION_LIST_OF_GAMES,
    DESTINATION_PLATAFORM_GAMES, 

    DESTINATION_CATEGORY,
    DESTINATION_CATEGORIES, 
    DESTINATION_CATEGORIES_UPDATES,
    DESTINATION_LIST_OF_CATEGORIES,

    DESTINATION_PLATAFORM,
    DESTINATION_PLATAFORMS,
    DESTINATION_LIST_OF_PLATAFORMS,
    DESTINATION_PLATAFORMS_UPDATES,

    DESTINATION_COMMENT,
    DESTINATION_LOGIN,
    DESTINATION_SIGNIN,
    DESTINATION_REPORT,
    DESTINATION_RECOVERY
];
