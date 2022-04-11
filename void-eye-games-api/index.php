<?php
use src\domain\AtlasProvider;
use src\domain\DatabaseProvider;

session_save_path(sys_get_temp_dir());

include_once('autoload.php');

$config = include('./settings.php');
$app = new Slim\App(["settings" => $config]);
$app->get('/users', 'src\controllers\BaseController:getUsers');
$app->get('/game/{id}', 'src\controllers\BaseController:gatGame');
$app->get('/games', 'src\controllers\BaseController:getGames');
$app->get('/categories', 'src\controllers\BaseController:getCategories');
$app->get('/plataforms', 'src\controllers\BaseController:getPlataforms');

$container = $app->getContainer();
DatabaseProvider::newInstance($container);
AtlasProvider::newInstance($container);

$app->run();
