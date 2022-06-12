<?php
/**
 * File: constants.php
 * Purpose: App constants variables.
 * DB Access: No
 * Uses files:
 *  - NONE
 * Used from:
 *  - index.php (as implementation, so can be used from all classes)
 */

/* DB CONSTANTS */
define('DB_DEFAULT_DOMAIN', 'localhost');
define('DB_DEFAULT_NAME', 'void_eye_games');
define('DB_DEFAULT_USER', 'root');
define('DB_DEFAULT_PASSWORD', '');

/* TOKEN */
define('TOKEN_NUM_BYTES', 16);

/* Others */
define('DATE_FORMAT', 'd/m/Y');
define('TIME_FORMAT', 'h:m:s');

/* ACCOUNT TYPES */
/**
 * @var ACCOUNT_TYPE_ADMIN the account type value for Admins privileges.
 */
define('ACCOUNT_TYPE_ADMIN', 0);

/**
 * @var ACCOUNT_TYPE_LOGGED_USER the account type value for logged users privileges.
 */
define('ACCOUNT_TYPE_LOGGED_USER', 1);

/**
 * @var ACCOUNT_TYPE_UNKNOWN the account type value for unknowns privileges.
 */
define('ACCOUNT_TYPE_UNKNOWN', 2);

/* QUERIES */
define('QUERY_GAMES_PER_PAGE', 12);
define('QUERY_COMMENTS_PER_GAME', 3);