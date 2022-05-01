<?php
namespace src\controllers;

use Atlas\Orm\Atlas;
use classes\CategoriesGame\CategoriesGame;
use classes\Category\Category;
use classes\Comment\Comment;
use classes\Game\Game;
use classes\Media\Media;
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
use src\domain\JWTManager;
use src\libraries\EmailManager;
use src\libraries\LogManager;
use src\validators\CategoryValidator;
use src\validators\GameValidator;
use src\validators\PlataformValidator;
use src\validators\SignUserValidator;

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
        $plataformsGames = $this->atlas->select(PlataformsGame::class, [])->with(['games' => ['medias'], 'plataforms'])->fetchRecords();
        return $response->withJson($plataformsGames, 200);
    }

    /*** POSTS ***/
    public function signIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] signIn called.", Logger::INFO);

        $body = $request->getParsedBody()['data'];
        $validator = new SignUserValidator();
        $validator->setAtlas($this->atlas);
        $validator->validate($body);
        if ($validator->hasErrors()) {
            return $response->withJson($validator->getErrors(), 400);
        }
        $this->atlas->insert($this->atlas->newRecord(User::class, $body));
        $credentials = (new JWTManager())->generate($body['name'], 'User');
        return $response->withJson($credentials, 200);
    }

    public function logIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] logIn called. ", Logger::INFO);
        try {
            $body = $request->getParsedBody()['data'];
            $username = $body->username ?? $body['username'] ?? $_REQUEST['Username'] ?? '';
            $password = $body->password ?? $body['password'] ?? $_REQUEST['Password'] ?? '';
            $dbUser = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
            if ($dbUser !== null && $dbUser->password === $password) {
                $credentials = (new JWTManager())->generate($username, $dbUser->accountType);
                return $response->withJson($credentials, 200);
            }
        } catch(Exception $ex) { 
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
        }
        $this->resultCode = 403;
        $this->resultMessage = 'Ivalid Username or Password.';
        return $this->createJsonResponseMessage($response);
    }

    public function sendReport(Request $request, Response $response, array $args){
        $this->logger->log("[POST] sendReport called.", Logger::INFO);
        try {
            $body = $request->getParsedBody()['data'];
            $mailSender = new EmailManager();
            $mailSender->send($body);
        } catch(Exception $ex) {
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
            $this->resultCode = -1;
            $this->resultMessage = "No se pudo enviar el reporte, intentalo mas tarde."; 
        }
        return $this->createJsonResponseMessage($response);
    }

    /*** INSERTS ***/
    public function addGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addGame called.", Logger::INFO);
        try {
            $game = $request->getParsedBody()['data'];
            $validator = new GameValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($game);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $game['categories'] = [];
            $game['plataforms'] = [];
            $game['medias'] = $this->parseArrayToRecord($game['medias'], Media::class);
            $game['comments'] = $this->parseArrayToRecord($game['comments'], Comment::class);
            $game['categories_games'] = $this->parseArrayToRecord($game['categories_games'], CategoriesGame::class);
            $game['plataforms_games'] = $this->parseArrayToRecord($game['plataforms_games'], PlataformsGame::class);
            $record = $this->atlas->newRecord(Game::class, $game);
            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $this->atlas->commit();
        } catch(Exception $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    public function addCategory(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addCategory called.", Logger::INFO);
        try {
            $category = $request->getParsedBody()['data'];
            $validator = new CategoryValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($category);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $category['games'] = [];
            $category['categories_games'] = $this->parseArrayToRecord($category['categories_games'], CategoriesGame::class);

            $record = $this->atlas->newRecord(Category::class, $category);
            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();
        } catch(Exception $ex) { 
            $this->atlas->rollBack();
            $this->processException($ex); 
        }
        return $this->createJsonResponseMessage($response);
    }

    public function addPlataform(Request $request, Response $response, array $args) {
        $this->logger->log("[POST] addPlataform called.", Logger::INFO);
        try {
            $plataforms = $request->getParsedBody()['data'];
            $validator = new PlataformValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($plataforms);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $plataforms['games'] = [];
            $plataforms['plataforms_games'] = $this->parseArrayToRecord($plataforms['plataforms_games'], PlataformsGame::class);
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    public function addComment(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addComment called.", Logger::INFO);
        try {
            $comment = $request->getParsedBody()['data'];
            $comment['games'] = [];
            $comment['users'] = [];
            $record = $this->atlas->newRecord(Comment::class, $comment);
            
            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $this->atlas->commit();
        } catch(Exception $ex) { 
            $this->atlas->rollBack();
            $this->processException($ex); 
        }
        return $this->createJsonResponseMessage($response);
    }

    /*** UPDATES ***/
    public function updateGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] updateGame called.", Logger::INFO);
        try {
            $game = $request->getParsedBody()['data'];
            $validator = new GameValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($game);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $game['categories'] = [];
            $game['plataforms'] = [];
            $game['medias'] = $this->parseArrayToRecord($game['medias'], Media::class);
            $game['comments'] = $this->parseArrayToRecord($game['comments'], Comment::class);
            $game['categories_games'] = $this->parseArrayToRecord($game['categories_games'], CategoriesGame::class);
            $game['plataforms_games'] = $this->parseArrayToRecord($game['plataforms_games'], PlataformsGame::class);
            $record = $this->atlas->newRecord(Game::class, $game);
            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();
        } catch(Exception $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    /*** DELETES ***/
    public function deleteGameOnPlataform(Request $request, Response $response, array $args){
        $this->logger->log("[DELETE] deleteGameOnPlataform called.", Logger::INFO);
        try {
            $this->atlas->delete($this->atlas->newRecord(Game::class, $request->getParsedBody()['data']));
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    /*** UTILS ***/
    private function parseArrayToRecord($array, $class) {
        $gameSet = $this->atlas->newRecordSet($class);
        foreach ($array as $value) {
            $gameSet->appendNew($value);
        }
        return $gameSet;
    }

    private function processException(Exception $ex) {
        $this->logger->log($ex->getMessage(), Logger::ERROR);
        $this->resultCode = 400;
        $this->resultMessage = $ex->getMessage();
    }

    private function createJsonResponseMessage(Response $response) {
        $messageObject = json_decode('{"code": "'.$this->resultCode.'", "message": "'.$this->resultMessage.'"}');
        return $response->withJson($messageObject, $this->resultCode);
    }
}