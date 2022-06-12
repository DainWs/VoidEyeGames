/**
 * File: EventsEnum.js
 * Purpose: This file exports all types of events.
 * DB Access: No
 * Used from:
 *  - Can be used for all classes.
 * Uses files:
 *  - The following imported files:
 */
import { DESTINATION_CATEGORIES, DESTINATION_GAMES, DESTINATION_LOGIN, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES, DESTINATION_SIGNIN } from "../services/socket/SocketDestinations";

export const EVENT_SEARCH_GAME = 'searchGame';
export const EVENT_CONTEXT_MENU_CLICK = 'contextMenuClick';

export const EVENT_SESSION_CHANGE = 'SessionChangeEvent';
export const EVENT_SESSION_LOGIN = DESTINATION_LOGIN;
export const EVENT_SESSION_SIGNIN = DESTINATION_SIGNIN;

export const EVENT_GAMES_DATA_UPDATE = DESTINATION_GAMES;
export const EVENT_PLATAFORMS_DATA_UPDATE = DESTINATION_PLATAFORMS;
export const EVENT_CATEGORIES_DATA_UPDATE = DESTINATION_CATEGORIES;
export const EVENT_PLATAFORM_GAME_DATA_UPDATE = DESTINATION_PLATAFORM_GAMES;