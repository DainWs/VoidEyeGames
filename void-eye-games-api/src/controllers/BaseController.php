<?php
namespace src\controllers;

use PDO;
use Exception;
use Monolog\Logger;
use Slim\Route;
use Slim\Http\Request;
use Slim\Http\Response;
use Atlas\Orm\Atlas;
use classes\User\User;
use classes\Game\Game;
use classes\Media\Media;
use classes\Comment\Comment;
use classes\Category\Category;
use classes\Plataform\Plataform;
use classes\CategoriesGame\CategoriesGame;
use classes\PlataformsGame\PlataformsGame;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
use src\domain\AuthManager;
use src\libraries\EmailManager;
use src\libraries\LogManager;
use src\validators\CategoryValidator;
use src\validators\GameValidator;
use src\validators\PlataformValidator;
use src\validators\SignUserValidator;

class BaseController {
    private const ORDER_METHODS = [
        'name' => 'games.name',
        'price' => 'plataforms_games.price',
        'plataform' => 'plataforms.name'
    ];

    private LogManager $logger;
    private PDO $db;
    private Atlas $atlas;

    private int $resultCode = 200;
    private String $resultMessage = 'OK';

    public function __construct() {
        $this->logger = new LogManager(BaseController::class);
        $this->db = DatabaseProvider::getInstance();
        $this->atlas = AtlasProvider::getInstance();
    }

    //----------------------------------------------------------------------------------
    //##################################################################################
    // GETS
    //##################################################################################
    //----------------------------------------------------------------------------------

    //----------------------------------------------------------------------------------
    // GAME SECTION
    //----------------------------------------------------------------------------------
    public function getGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGames called.");

        /* PAGE */
        $pageNum = $request->getParam('pageNum', []);
        $pageNum = ($pageNum < 1) ? 1 : $pageNum;
        $pageStart = ($pageNum - 1) * QUERY_GAMES_PER_PAGE;

        /* CATEGORIES */
        $gamesInCategories = [];
        $categoriesIds = $request->getParam('categories', []);
        if (!empty($categoriesIds)) {
            try {
                $this->logger->log("Exception " . json_encode($categoriesIds));
                $gamesInCategories = $this->atlas->select(CategoriesGame::class)
                    ->columns('gamesId', 'count(categoriesId) as numCategories')
                    ->where('categoriesId IN', $categoriesIds)
                    ->groupBy('gamesId')
                    ->having('numCategories =', count($categoriesIds))
                    ->fetchColumn();
            } catch(Exception $ex) {
                $this->logger->log("Exception " . $ex->getMessage());
            }
        }

        /* PLATAFORMS */
        $plataformsIds = $request->getParam('plataforms', []);

        /* OTHERS */
        $search = $request->getParam('name', '');
        $sortBy = $request->getParam('sort', 'name');

        /* QUERY */
        $query = $this->atlas->select(PlataformsGame::class)
            ->with(['plataforms', 'games' => ['medias']])
            ->joinWith('plataforms')
            ->joinWith('games')
            ->where('games.name LIKE ', "%$search%")
            ->orderBy(SELF::ORDER_METHODS[$sortBy] ?? 'games.name')
            ->offset($pageStart)
            ->limit(QUERY_GAMES_PER_PAGE);
        
        if (!empty($plataformsIds)) {
            $query = $query->where('plataforms_games.plataformsId IN', $plataformsIds);
        }

        if (!empty($gamesInCategories)) {
            $query = $query->andWhere('plataforms_games.gamesId IN', $gamesInCategories);
        }

        return $response->withJson($query->fetchRecords(), 200);
    }

    public function getGame(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getGame called.");

        /* ID */
        $gameId = $request->getParam('id', 1);

        $game = $this->atlas->select(Game::class)
            ->with(['medias', 'plataforms_games' => ['plataforms']])
            ->where('id =', $gameId)
            ->fetchRecord();
        
        $plataformsGames = $this->atlas->select(PlataformsGame::class)
            ->with(['plataforms'])
            ->where('gamesId =', $game->id)
            ->orderBy('discount DESC', '(price - (price * discount))')
            ->fetchRecordSet();
        $game->plataforms_games = $plataformsGames;

        $comments = $this->atlas->select(Comment::class)
            ->with(['users'])
            ->where('gamesId =', $game->id)
            ->limit(QUERY_COMMENTS_PER_GAME)
            ->fetchRecordSet();
        $game->comments = $comments;

        return $response->withJson($game, 200);
    }

    //----------------------------------------------------------------------------------
    // COMMENTS SECTION
    //----------------------------------------------------------------------------------
    public function getComments(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getComments called.");

        /* PAGE */
        $pageNum = $request->getParam('pageNum', []);
        $pageNum = ($pageNum < 1) ? 1 : $pageNum;
        $pageStart = ($pageNum - 1) * QUERY_COMMENTS_PER_GAME;

        /* GAME ID */
        $gameId = $request->getParam('gameId', 1);
        
        $comments = $this->atlas->select(Comment::class)
            ->with(['users'])
            ->where('gamesId =', $gameId)
            ->offset($pageStart)
            ->limit(QUERY_COMMENTS_PER_GAME)
            ->fetchRecords();
        return $response->withJson($comments, 200);
    }

    //----------------------------------------------------------------------------------
    // CATEGORIES SECTION
    //----------------------------------------------------------------------------------
    public function getCategories(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getCategories called.");
        $categories = $this->atlas->select(Category::class)->fetchRecords();
        return $response->withJson($categories, 200);
    }

    //----------------------------------------------------------------------------------
    // PLATAFORMS SECTION
    //----------------------------------------------------------------------------------
    public function getPlataforms(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getPlataforms called.");
        $plataforms = $this->atlas->select(Plataform::class)->fetchRecords();
        return $response->withJson($plataforms, 200);
    }

    //----------------------------------------------------------------------------------
    //##################################################################################
    // POSTS
    //##################################################################################
    //----------------------------------------------------------------------------------
    
    //----------------------------------------------------------------------------------
    // SESSIONS SECTION
    //----------------------------------------------------------------------------------
    public function signIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] signIn called.");

        $body = $request->getParsedBody()['data'];
        $validator = new SignUserValidator();
        $validator->setAtlas($this->atlas);
        $validator->validate($body);
        if ($validator->hasErrors()) {
            return $response->withJson($validator->getErrors(), 400);
        }
        $this->atlas->insert($this->atlas->newRecord(User::class, $body));
        $credentials = (new AuthManager())->registre($body['name'], 'User');
        return $response->withJson($credentials, 200);
    }

    public function logIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] logIn called. ");
        try {
            $body = $request->getParsedBody()['data'];
            $username = $body->username ?? $body['username'] ?? $_REQUEST['Username'] ?? '';
            $password = $body->password ?? $body['password'] ?? $_REQUEST['Password'] ?? '';
            $dbUser = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
            if ($dbUser !== null && $dbUser->password === $password) {
                $credentials = (new AuthManager())->registre($username, $dbUser->accountType);
                return $response->withJson($credentials, 200);
            }
        } catch(Exception $ex) { 
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
        }
        $this->resultCode = 403;
        $this->resultMessage = 'Ivalid Username or Password.';
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // REPORTS SECTION
    //----------------------------------------------------------------------------------
    public function sendReport(Request $request, Response $response, array $args){
        $this->logger->log("[POST] sendReport called.");
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

    //----------------------------------------------------------------------------------
    //##################################################################################
    // PUTS
    //##################################################################################
    //----------------------------------------------------------------------------------
    
    //----------------------------------------------------------------------------------
    // GAMES SECTION
    //----------------------------------------------------------------------------------
    public function addGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addGame called.");
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

    //----------------------------------------------------------------------------------
    // CATEGORY SECTION
    //----------------------------------------------------------------------------------
    public function addCategory(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addCategory called.");
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

    //----------------------------------------------------------------------------------
    // PLATAFORM SECTION
    //----------------------------------------------------------------------------------
    public function addPlataform(Request $request, Response $response, array $args) {
        $this->logger->log("[POST] addPlataform called.");
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

    //----------------------------------------------------------------------------------
    // COMMENTS SECTION
    //----------------------------------------------------------------------------------
    public function addComment(Request $request, Response $response, array $args){
        $this->logger->log("[POST] addComment called.");
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

    //----------------------------------------------------------------------------------
    //##################################################################################
    // UPDATES
    //##################################################################################
    //----------------------------------------------------------------------------------

    public function updateGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] updateGame called.");
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

    //----------------------------------------------------------------------------------
    //##################################################################################
    // DELETES
    //##################################################################################
    //----------------------------------------------------------------------------------
    public function deleteGameOnPlataform(Request $request, Response $response, array $args){
        $this->logger->log("[DELETE] deleteGameOnPlataform called.");
        try {
            $this->atlas->delete($this->atlas->newRecord(Game::class, $request->getParsedBody()['data']));
        } catch(Exception $ex) { $this->processException($ex); }
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    //##################################################################################
    // UTILS
    //##################################################################################
    //----------------------------------------------------------------------------------
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