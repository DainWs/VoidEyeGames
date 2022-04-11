<?php
namespace src\controllers;

use Atlas\Orm\Atlas;
use classes\Game\Game;
use classes\Media\Media;
use Monolog\Logger;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\User\User;
use Exception;
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

    public function getUsers(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getUsers called.", Logger::INFO);
        $users = $this->atlas->select(User::class)->fetchRecordSet();
        return $response->withJson($users, 200);
    }

    public function getGame(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGame called.", Logger::INFO);
        return $response;
    }
    
    public function getGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGames called.", Logger::INFO);
        try {
            $games = $this->atlas->select(Media::class)->fetchRecords();
            return $response->withJson($games, 200);
        } catch(Exception $ex) {
            return $response->write($ex->getMessage());
        }
        return $response->write("aaaaaaaaa");
    }

    public function getCategories(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getCategories called.", Logger::INFO);
    }

    public function getPlataforms(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getPlataforms called.", Logger::INFO);
    }
}