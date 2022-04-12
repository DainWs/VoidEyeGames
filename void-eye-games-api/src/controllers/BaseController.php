<?php
namespace src\controllers;

use Atlas\Orm\Atlas;
use classes\Category\Category;
use classes\Game\Game;
use classes\Plataform\Plataform;
use Monolog\Logger;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\User\User;
use PDO;
use src\domain\AtlasProvider;
use src\domain\DatabaseProvider;
use src\libraries\LogManager;

class BaseController {
    private LogManager $logger;
    private PDO $db;
    private Atlas $atlas;

    public function __construct() {
        $this->logger = new LogManager(BaseController::class);
        $this->db = DatabaseProvider::getInstance();
        $this->atlas = AtlasProvider::getInstance();
    }

    /*** QUERIES ***/

    public function getUser(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getUser called.", Logger::INFO);
        $games = $this->atlas->select(User::class, ['name', $args['name']])->with(['comments'])->fetchRecordSet();
        return $response->withJson($games, 200);
    }

    public function getUsers(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getUsers called.", Logger::INFO);
        $users = $this->atlas->select(User::class)->with(['comments'])->fetchRecordSet();
        return $response->withJson($users, 200);
    }

    public function getGame(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGame called.", Logger::INFO);
        $games = $this->atlas->select(Game::class, ['id', $args['id']])
            ->with([
                'medias',
                'plataforms_games',
                'plataforms',
                'categories',
                'comments' => [
                    'users'
                ]
            ])->fetchRecords();
        return $response->withJson($games, 200);
    }
    
    public function getGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGames called.", Logger::INFO);
        $games = $this->atlas->select(Game::class, [])
            ->with([
                'medias',
                'plataforms_games',
                'plataforms',
                'categories',
                'comments' => [
                    'users'
                ]
            ])->fetchRecords();
        return $response->withJson($games, 200);
    }

    public function getCategories(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getCategories called.", Logger::INFO);
        $games = $this->atlas->select(Category::class, [])->with(['games'])->fetchRecords();
        return $response->withJson($games, 200);
    }

    public function getPlataforms(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getPlataforms called.", Logger::INFO);
        $games = $this->atlas->select(Plataform::class, [])->with(['games'])->fetchRecords();
        return $response->withJson($games, 200);
    }

    /*** Sessions ***/

    public function signIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] signIn called.", Logger::INFO);
        return $response;
    }

    public function logIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] logIn called.", Logger::INFO);
        return $response;
    }

    /*** INSERTS ***/

    public function addGame(Request $request, Response $response, array $args){
        $this->logger->log("[PUT] addGame called.", Logger::INFO);
        return $response;
    }

    public function addComment(Request $request, Response $response, array $args){
        $this->logger->log("[PUT] addComment called.", Logger::INFO);
        return $response;
    }
}