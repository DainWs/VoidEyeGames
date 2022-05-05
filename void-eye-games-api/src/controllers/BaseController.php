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
use classes\Category\CategoryRecord;
use classes\Game\GameRecord;
use classes\PlataformsGame\PlataformsGame;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
use src\domain\AuthManager;
use src\domain\dto\JsonResponse;
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
            
            if (empty($gamesInCategories)) {
                return $response->withJson([], 200);
            }
        }

        /* PLATAFORMS */
        $plataformsIds = $request->getParam('plataforms', []);

        /* OTHERS */
        $search = $request->getParam('name', '');
        $sortBy = $request->getParam('sort', 'name');
        $discount = $request->getParam('discount', false);

        /* QUERY */
        $query = $this->atlas->select(PlataformsGame::class)
            ->with(['plataforms', 'games' => ['medias']])
            ->joinWith('plataforms')
            ->joinWith('games')
            ->where('games.name LIKE ', "%$search%")
            ->where('isEnabled =', true)
            ->orderBy(SELF::ORDER_METHODS[$sortBy] ?? 'games.name')
            ->offset($pageStart)
            ->limit(QUERY_GAMES_PER_PAGE);
        
        if ($discount) {
            $query = $query->where('plataforms_games.discount >', 0);
        }

        if (!empty($plataformsIds)) {
            $query = $query->where('plataforms_games.plataformsId IN', $plataformsIds);
        }

        if (!empty($gamesInCategories)) {
            $query = $query->andWhere('plataforms_games.gamesId IN', $gamesInCategories);
        }

        return $response->withJson($query->fetchRecords(), 200);
    }
    
    public function getListOfGames(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getListOfGames called.");
        $games = $this->atlas->select(Game::class)->fetchRecords();
        return $response->withJson($games, 200);
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
            ->where('isEnabled =', true)
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

    public function getCategory(Request $request, Response $response, array $args) {
        $this->logger->log("[GET] getCategories called.");
        $id = $request->getParam('id', 1);
        $category = $this->atlas->select(Category::class, ['id' =>  $id])
            ->with(['games'])
            ->fetchRecord();
        return $response->withJson($category, 200);
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
            $jsonResponse = new JsonResponse(400, $validator->getErrors());
            return $response->withJson($jsonResponse, 200);
        }
        $this->atlas->insert($this->atlas->newRecord(User::class, $body));

        $credentials = (new AuthManager())->registre($body['name']);
        $jsonResponse = new JsonResponse(200, $credentials);
        return $response->withJson($jsonResponse, 200);
    }

    public function logIn(Request $request, Response $response, array $args){
        $this->logger->log("[POST] logIn called. ");
        try {
            $body = $request->getParsedBody()['data'];
            $username = $body->username ?? $body['username'] ?? $_REQUEST['Username'] ?? '';
            $password = $body->password ?? $body['password'] ?? $_REQUEST['Password'] ?? '';
            $dbUser = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
            if ($dbUser !== null && $dbUser->password === $password) {
                $credentials = (new AuthManager())->registre($dbUser->name, $dbUser->accountType);
                $jsonResponse = new JsonResponse(200, $credentials);
                return $response->withJson($jsonResponse, 200);
            }
        } catch(Exception $ex) { 
            $this->logger->log("Exception in signIn method: " . $ex->getMessage(), Logger::WARNING);
        }
        $jsonResponse = new JsonResponse(403, 'Ivalid Username or Password.');
        return $response->withJson($jsonResponse, 200);
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
            $this->logger->log(json_encode($game));
            $validator = new GameValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($game);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $game['categories'] = null;
            $game['plataforms'] = null;
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
            $this->logger->log(json_encode($category));
            $validator = new CategoryValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($category);
            if ($validator->hasErrors()) {
                return $response->withJson($validator->getErrors(), 400);
            }

            $categoriesGames = $category['categories_games'];
            $category['id'] = null;
            $category['games'] = null;
            $category['categories_games'] = null;
            $record = $this->atlas->newRecord(Category::class, $category);
            $record->categories_games = $this->atlas->newRecordSet(CategoriesGame::class);
            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            foreach ($categoriesGames as $value) {$record->add($value);}
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
            
            $plataformsGames = $plataforms['plataforms_games'];
            $plataforms['id'] = null;
            $plataforms['games'] = null;
            $plataforms['plataforms_games'] = null;
            $record = $this->atlas->newRecord(Plataform::class, $plataforms);
            $record->plataforms_games = $this->atlas->newRecordSet(PlataformsGame::class);

            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            foreach ($plataformsGames as $value) {$record->add($value);}
            $this->atlas->persist($record);
            $this->atlas->commit();
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
            $user = $this->atlas->select(User::class, ['name' => $comment['usersId']])->fetchRecord();
            $comment['usersId'] = $user->id;
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

    //----------------------------------------------------------------------------------
    // GAMES SECTION
    //----------------------------------------------------------------------------------
    public function updateGame(Request $request, Response $response, array $args){
        $this->logger->log("[POST] updateGame called.");
        try {
            $game = $request->getParsedBody()['data'];
            /** @var GameRecord $record */
            $record = $this->atlas->select(Game::class, ['id' => $game['id']])
                ->with(['medias', 'plataforms_games', 'categories_games'])
                ->fetchRecord();
            $record->name = $game['name'];
            $record->description = $game['description'];
            $record->updateMedias($game['medias']);
            $record->updateCategoriesGames($game['categories_games']);
            $record->updatePlataformsGames($game['plataforms_games']);
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
    // CATEGORY SECTION
    //----------------------------------------------------------------------------------
    public function updateCategory(Request $request, Response $response, array $args){
        $this->logger->log("[POST] updateCategory called.");
        try {
            $category = $request->getParsedBody()['data'];
            /** @var CategoryRecord $record */
            $record = $this->atlas->select(Category::class, ['id' => $category['id']])
                ->with(['categories_games'])
                ->fetchRecord();
            $record->name = $category['name'];
            $record->updateCategoriesGames($category['categories_games']);

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
            $game = $request->getParsedBody()['data'];
            $record = $this->atlas->select(Game::class, ['id' => $game->id])
                ->with(['plataforms_games'])
                ->fetchRecord();
            
            
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
        $messageObject = new JsonResponse($this->resultCode, $this->resultMessage);
        return $response->withJson($messageObject, 200);
    }
}