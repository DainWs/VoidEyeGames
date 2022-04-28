<?php
use \Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use src\domain\AtlasProvider;
use src\domain\AuthMiddleware;
use src\domain\DatabaseProvider;

session_save_path(sys_get_temp_dir());

include_once('autoload.php');

$config = include('./settings.php');
$app = new Slim\App(["settings" => $config]);
$app->add(function($request, $response, $next) {
    $response = $next($request, $response);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
});

$app->post('/', function(Request $request, Response $response, array $args) {
    return $response->withBody($request->getBody(), 200);
});

// Users
$app->group('/users', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getUsers');

    /**
     * Documentation for '/user/{by}/{value}' uri.
     * @param by - must be one of the following: id, name, email
     * @param value - depending on the 'by' parameter, this will refer to the id/name/email
     */
    $app->get('/{by}/{value}', 'src\controllers\BaseController:getUser');
});

$app->post('/signIn', 'src\controllers\BaseController:signIn');
$app->post('/logIn', 'src\controllers\BaseController:logIn');

// Games
$app->group('/games', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getGames');
    $app->post('', 'src\controllers\BaseController:addGame')->add(new AuthMiddleware());
    $app->put('', 'src\controllers\BaseController:updateGame')->add(new AuthMiddleware());

    /**
     * Documentation for '/game/{by}/{value}' uri.
     * @param by - must be one of the following: id, name
     * @param value - depending on the 'by' parameter, this will refer to the id/name
     */
    $app->get('/{by}/{value}', 'src\controllers\BaseController:getGame');

    $app->post('/categories', 'src\controllers\BaseController:updateCategoriesToGame')->add(new AuthMiddleware());

    $app->delete('/plataform', 'src\controllers\BaseController:deleteGameOnPlataform')->add(new AuthMiddleware());
});

// Categories
$app->group('/categories', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getCategories');

    $app->group('/add', function () use ($app) {
        $app->post('', 'src\controllers\BaseController:addCategory');
        $app->post('/game', 'src\controllers\BaseController:addGameToCategory');
    })->add(new AuthMiddleware());
});

// Plataforms
$app->group('/plataforms', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getPlataforms');

    $app->group('/add', function () use ($app) {
        $app->post('', 'src\controllers\BaseController:addPlataform');
        $app->post('/game', 'src\controllers\BaseController:addGameToPlataforms');
    })->add(new AuthMiddleware());

    $app->group('/set', function () use ($app) {
        $app->post('/game', 'src\controllers\BaseController:updatePlataformsToGame');
    })->add(new AuthMiddleware());
});

// PlataformGames
$app->get('/plataformGames', 'src\controllers\BaseController:getPlataformsGames');

// Comments
$app->post('/comment', 'src\controllers\BaseController:addComment')->add(new AuthMiddleware());

// Send Reports
$app->post('/report', 'src\controllers\BaseController:sendReport');

$container = $app->getContainer();
DatabaseProvider::newInstance($container);
AtlasProvider::newInstance($container);

$app->run();
