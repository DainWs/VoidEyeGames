<?php
use src\domain\AtlasProvider;
use src\domain\DatabaseProvider;

session_save_path(sys_get_temp_dir());

include_once('autoload.php');

$config = include('./settings.php');
$app = new Slim\App(["settings" => $config]);

// Users
$app->group('/users', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getUsers');

    /**
     * Documentation for '/user/{by}/{value}' uri.
     * @param by - must be one of the following: id, name, email
     * @param value - depending on the 'by' parameter, this will refer to the id/name/email
     */
    $app->get('/{by}/{value}', 'src\controllers\BaseController:getUser');
    
    $app->post('/signIn', 'src\controllers\BaseController:signIn');
    $app->post('/logIn', 'src\controllers\BaseController:logIn');
});

// Games
$app->group('/games', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getGames');
    $app->post('', 'src\controllers\BaseController:addGame');
    $app->put('', 'src\controllers\BaseController:updateGame');

    /**
     * Documentation for '/game/{by}/{value}' uri.
     * @param by - must be one of the following: id, name
     * @param value - depending on the 'by' parameter, this will refer to the id/name
     */
    $app->get('/{by}/{value}', 'src\controllers\BaseController:getGame');

    $app->post('/categories', 'src\controllers\BaseController:updateCategoriesToGame');

    $app->delete('/plataform', 'src\controllers\BaseController:deleteGameOnPlataform');
});

// Categories
$app->group('/categories', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getCategories');

    $app->group('/add', function () use ($app) {
        $app->post('', 'src\controllers\BaseController:addCategory');
        $app->post('/game', 'src\controllers\BaseController:addGameToCategory');
    });
});

// Plataforms
$app->group('/plataforms', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getPlataforms');

    $app->group('/add', function () use ($app) {
        $app->post('', 'src\controllers\BaseController:addPlataform');
        $app->post('/game', 'src\controllers\BaseController:addGameToPlataforms');
    });

    $app->group('/set', function () use ($app) {
        $app->post('/game', 'src\controllers\BaseController:updatePlataformsToGame');
    });
});

// Comments
$app->post('/comment', 'src\controllers\BaseController:addComment');

// Send Reports
$app->post('/report', 'src\controllers\BaseController:sendReport');

$container = $app->getContainer();
DatabaseProvider::newInstance($container);
AtlasProvider::newInstance($container);

$app->run();
