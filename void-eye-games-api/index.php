<?php
use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\dto\JsonResponse;
use src\domain\middlewares\AuthMiddleware;
use src\domain\middlewares\HeadersMiddleware;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
include_once('autoload.php');

$config = include('./SlimSettings.php');
$app = new Slim\App(["settings" => $config]);

/*==== MIDDLEWARES ====*/
$app->add(new HeadersMiddleware());

/*==== REQUESTS ====*/
$app->post('/', function(Request $request, Response $response, array $args) {
    $jsonResponse = new JsonResponse(404, $request->getParsedBody());
    return $response->withJson($jsonResponse, 404);
});

$app->post('/signIn', 'src\controllers\BaseController:signIn');
$app->post('/logIn', 'src\controllers\BaseController:logIn');

// Games
$app->group('/game', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getGame');

    $app->group('s', function () use ($app) {
        $app->post('', 'src\controllers\BaseController:addGame')->add(new AuthMiddleware());
        $app->put('', 'src\controllers\BaseController:updateGame')->add(new AuthMiddleware());

        /**
         * The url param {pageNum} is the page num that you are loading.
         * The url param {name} is used to search for specific game names.
         * The url param {sort} can be one of the follows: name, price, plataform.
         * The url param {categories} are the categories of the games.
         * The url param {plataforms} are the plataforms of the games.
         */
        $app->get('', 'src\controllers\BaseController:getGames');

        $app->get('/listed', 'src\controllers\BaseController:getListOfGames');
    });
});

// Categories
$app->get('/category', 'src\controllers\BaseController:getCategory');

$app->group('/categories', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getCategories');
    $app->post('', 'src\controllers\BaseController:addCategory')->add(new AuthMiddleware());
    $app->post('/update', 'src\controllers\BaseController:updateCategory')->add(new AuthMiddleware());
});

// Plataforms

$app->get('/plataform', 'src\controllers\BaseController:getCategory');
$app->group('/plataforms', function () use ($app) {
    $app->get('', 'src\controllers\BaseController:getPlataforms');
    $app->post('', 'src\controllers\BaseController:addPlataform')->add(new AuthMiddleware());
    $app->post('/update', 'src\controllers\BaseController:updatePlataform')->add(new AuthMiddleware());
});

// Comments
$app->post('/comment', 'src\controllers\BaseController:addComment')->add(new AuthMiddleware());

// Send Reports
$app->post('/report', 'src\controllers\BaseController:sendReport');

$container = $app->getContainer();
DatabaseProvider::newInstance($container);
AtlasProvider::newInstance($container);

$app->run();
