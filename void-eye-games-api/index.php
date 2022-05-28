<?php
use src\domain\middlewares\AuthMiddleware;
use src\domain\middlewares\HeadersMiddleware;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
include_once('autoload.php');

$container = [];
$container["settings"] = include('./SlimSettings.php');
$container['notFoundHandler'] = function ($config) {
    return function ($request, $response) use ($config) {
        return $response
            ->withHeader('Location', $_SERVER['APP_BASE_URL'].'/assets/images/not-found.png')
            ->withStatus(302);
    };
};
$app = new Slim\App($container);

/*==== MIDDLEWARES ====*/
$app->add(new HeadersMiddleware());

/*==== REQUESTS ====*/
/**
 * The url param {showComponents} is used to request components states. (boolean)
 * The url param {showLibraries} is used to request libraries states. (boolean)
 * The url param {showDetails} is used to request details. (boolean)
 */
$app->get('/', 'src\controllers\HealthController:health');
$app->get('/health', 'src\controllers\HealthController:health');

$app->post('/signIn', 'src\controllers\SessionController:signIn');
$app->post('/logIn', 'src\controllers\SessionController:logIn');

// Games
$app->group('/game', function () use ($app) {
    /**
     * The url param {id} is the game id.
     */
    $app->get('', 'src\controllers\SelectController:getGame');
    $app->post('', 'src\controllers\InsertController:addGame')->add(new AuthMiddleware());
    $app->post('/update', 'src\controllers\UpdateController:updateGame')->add(new AuthMiddleware());

    $app->group('s', function () use ($app) {
        /**
         * The url param {pageNum} is the page num that you are loading.
         * The url param {name} is used to search for specific game names.
         * The url param {sort} can be one of the follows: name, price, plataform.
         * The url param {categories} are the categories of the games.
         * The url param {plataforms} are the plataforms of the games.
         */
        $app->get('', 'src\controllers\SelectController:getGames');

        $app->get('/listed', 'src\controllers\SelectController:getListOfGames');
    });
});

// Categories
$app->group('/category', function () use ($app) {
    /**
     * The url param {id} is the category id.
     */
    $app->get('', 'src\controllers\SelectController:getCategory');
    $app->post('', 'src\controllers\InsertController:addCategory')->add(new AuthMiddleware());
    $app->post('/update', 'src\controllers\UpdateController:updateCategory')->add(new AuthMiddleware());
});

$app->group('/categories', function () use ($app) {
    $app->get('', 'src\controllers\SelectController:getCategories');
    $app->get('/listed', 'src\controllers\SelectController:getListOfCategories');
});

// Plataforms
$app->group('/plataform', function () use ($app) {
    $app->get('', 'src\controllers\SelectController:getPlataform');
    $app->post('', 'src\controllers\InsertController:addPlataform')->add(new AuthMiddleware());
    $app->post('/update', 'src\controllers\UpdateController:updatePlataform')->add(new AuthMiddleware());

    $app->group('s', function () use ($app) {
        $app->get('', 'src\controllers\SelectController:getPlataforms');
        $app->get('/listed', 'src\controllers\SelectController:getListOfPlataforms');
    });
});

// Comments
$app->post('/comment', 'src\controllers\InsertController:addComment')->add(new AuthMiddleware());

// Send Reports
$app->post('/report', 'src\controllers\SessionController:sendReport');
$app->post('/recovery', 'src\controllers\SessionController:sendRecovery');

$container = $app->getContainer();
DatabaseProvider::newInstance($container);
AtlasProvider::newInstance($container);

$app->run();
