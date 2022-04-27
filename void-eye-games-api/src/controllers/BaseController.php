<?php
namespace src\controllers;

use Atlas\Orm\Atlas;
use classes\Category\Category;
use classes\Game\Game;
use classes\Plataform\Plataform;
use classes\PlataformsGame\PlataformsGame;
use Monolog\Logger;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\User\User;
use Exception;
use PDO;
use src\domain\AtlasProvider;
use src\domain\DatabaseProvider;
use src\libraries\EmailManager;
use src\libraries\LogManager;
use src\validators\GameValidator;
use src\validators\SignUserValidator;
use src\validators\UserValidator;

class BaseController {
    private LogManager $logger;
    private PDO $db;
    private Atlas $atlas;

    private int $resultCode = 200;
    private String $resultMessage = "OK";

    public function __construct() {
        $this->logger = new LogManager(BaseController::class);
        $this->db = DatabaseProvider::getInstance();
        $this->atlas = AtlasProvider::getInstance();
    }

    /*** GETS ***/
    public function getUser(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getUser called.", Logger::INFO);
        $byParam = $args['by'];
        $valueParam = $args['value'];
        $user = $this->atlas->select(User::class, [$byParam => $valueParam])->with(['comments'])->fetchRecordSet();
        return $response->withJson($user, 200);
    }

    public function getUsers(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getUsers called.", Logger::INFO);
        $users = $this->atlas->select(User::class)->with(['comments'])->fetchRecordSet();
        return $response->withJson($users, 200);
    }

    public function getGame(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGame called.", Logger::INFO);
        $byParam = $args['by'];
        $valueParam = $args['value'];
        $games = $this->atlas->select(Game::class, [$byParam => $valueParam])
            ->with(['medias', 'plataforms' => ['plataforms_games'], 'categories', 'comments' => [ 'users' ]])
            ->fetchRecords();
        return $response->withJson($games, 200);
    }
    
    public function getGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGames called.", Logger::INFO);
        $games = $this->atlas->select(Game::class, [])
            ->with(['medias', 'plataforms' => ['plataforms_games'], 'categories', 'comments' => [ 'users' ]])
            ->fetchRecords();
        return $response->withJson($games, 200);
    }

    public function getCategories(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getCategories called.", Logger::INFO);
        $categories = $this->atlas->select(Category::class, [])->with(['games'])->fetchRecords();
        return $response->withJson($categories, 200);
    }

    public function getPlataforms(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getPlataforms called.", Logger::INFO);
        $plataforms = $this->atlas->select(Plataform::class, [])->with(['games'])->fetchRecords();
        return $response->withJson($plataforms, 200);
    }

    public function getPlataformsGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getPlataformsGames called.", Logger::INFO);
        $plataformsGames = $this->atlas->select(PlataformsGame::class, [])->with(['games', 'plataforms'])->fetchRecords();
        return $response->withJson($plataformsGames, 200);
    }

    /*** POSTS ***/
    public function signIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] signIn called.", Logger::INFO);

        $validator = new SignUserValidator();
        $validator->setAtlas($this->atlas);
        $validator->validate($request->getParsedBody());
        if ($validator->hasErrors()) {
            return $response->withJson($validator->getErrors(), 200);
        }
        return $response->withJson(true, 200);
    }

    public function logIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] logIn called.", Logger::INFO);
        try {
            $body = $request->getParsedBody();
            $username = $body->Username ?? $_REQUEST['Username'] ?? '';
            $password = $body->Password ?? $_REQUEST['Password'] ?? '';
            $dbUser = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
            if ($dbUser->password === $password) {
                return $response->withJson(true, 200);
            }
        } catch(Exception $ex) { 
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
            $this->processException($ex);
            return $this->createJsonResponseMessage($response);
        }
        return $response->withJson(false, 200);
    }

    public function sendReport(Request $request, Response $response, array $args){
        $this->logger->log("[POST] sendReport called.", Logger::INFO);
        try {
            $mailSender = new EmailManager();
            $mailSender->send($request->getParsedBody());
        } catch(Exception $ex) {
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
            $this->resultCode = -1;
            $this->resultMessage = "No se pudo enviar el reporte, intentalo mas tarde."; 
        }
        return $this->createJsonResponseMessage($response);
    }

    /*** PUTS ***/
    public function addGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addGame called.", Logger::INFO);
        try {
            $game = $request->getParsedBody();
            $validator = new GameValidator();
            $validator->validate($game);
            if ($validator->hasErrors()) {
                $this->atlas->insert($game);
            }
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addCategory(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addCategory called.", Logger::INFO);
        try {
            $category = $request->getParsedBody();
            if ($category->name) {
                $this->atlas->insert($category);
            }
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addPlataform(Request $request, Response $response, array $args) {
        $this->logger->log("[POST] addPlataform called.", Logger::INFO);
        try {

        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addComment(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addComment called.", Logger::INFO);
        try {
            $this->atlas->insert($request->getParsedBody());
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addGameToCategory(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addGameToCategory called.", Logger::INFO);
        try {

        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addGameToPlataforms(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addGameToPlataforms called.", Logger::INFO);
        try {

        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    /*** UPDATES ***/
    public function updateGame(Request $request, Response $response, array $args){
        $this->logger->log("[PUT] updateGame called.", Logger::INFO);
        try {
            $this->atlas->update($request->getParsedBody());
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function updateCategoriesToGame(Request $request, Response $response, array $args){
        $this->logger->log("[PUT] updateCategoriesToGame called.", Logger::INFO);
        try {

        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function updatePlataformsToGame(Request $request, Response $response, array $args){
        $this->logger->log("[PUT] updatePlataformsToGame called.", Logger::INFO);
        try {

        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    /*** DELETES ***/
    public function deleteGameOnPlataform(Request $request, Response $response, array $args){
        $this->logger->log("[DELETE] deleteGameOnPlataform called.", Logger::INFO);
        try {
            $this->atlas->delete($request->getParsedBody());
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    /*** UTILS ***/
    private function processException(Exception $ex) {
        $this->resultCode = 400;
        $this->resultMessage = $ex->getMessage();
    }

    private function createJsonResponseMessage(Response $response) {
        $messageObject = json_decode('{"code": "'.$this->resultCode.'", "message": "'.$this->resultMessage.'"}');
        return $response->withJson($messageObject, $this->resultCode);
    }
}