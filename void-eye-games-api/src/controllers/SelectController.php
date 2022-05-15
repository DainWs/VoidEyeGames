<?php

namespace src\controllers;

use Exception;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\Game\Game;
use classes\Comment\Comment;
use classes\Category\Category;
use classes\Plataform\Plataform;
use classes\CategoriesGame\CategoriesGame;
use classes\PlataformsGame\PlataformsGame;

class SelectController extends BaseController
{
    private const ORDER_METHODS = [
        'name' => 'games.name',
        'price' => 'plataforms_games.price',
        'plataform' => 'plataforms.name'
    ];

    public function __construct() {
        parent::__construct(SelectController::class);
    }

    //----------------------------------------------------------------------------------
    // GAME SECTION
    //----------------------------------------------------------------------------------
    public function getGames(Request $request, Response $response, array $args)
    {
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
            } catch (Exception $ex) {
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

    public function getListOfGames(Request $request, Response $response, array $args)
    {
        $games = $this->atlas->select(Game::class)->fetchRecords();
        return $response->withJson($games, 200);
    }

    public function getGame(Request $request, Response $response, array $args)
    {
        /* ID */
        $gameId = $request->getParam('id', 1);

        $game = $this->atlas->select(Game::class)
            ->with(['medias', 'plataforms_games' => ['plataforms'], 'categories'])
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
    public function getComments(Request $request, Response $response, array $args)
    {
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
    public function getCategories(Request $request, Response $response, array $args)
    {
        $categories = $this->atlas->select(Category::class)->fetchRecords();
        return $response->withJson($categories, 200);
    }

    public function getCategory(Request $request, Response $response, array $args)
    {
        $id = $request->getParam('id', -1);
        $category = $this->atlas->select(Category::class, ['id' =>  $id])
            ->with(['games'])
            ->fetchRecord();
        return $response->withJson($category, 200);
    }

    public function getListOfCategories(Request $request, Response $response, array $args)
    {
        $categories = $this->atlas->select(Category::class)->fetchRecords();
        return $response->withJson($categories, 200);
    }

    //----------------------------------------------------------------------------------
    // PLATAFORMS SECTION
    //----------------------------------------------------------------------------------
    public function getPlataforms(Request $request, Response $response, array $args)
    {
        $plataforms = $this->atlas->select(Plataform::class)->fetchRecords();
        return $response->withJson($plataforms, 200);
    }

    public function getPlataform(Request $request, Response $response, array $args)
    {
        $id = $request->getParam('id', -1);
        $plataform = $this->atlas->select(Plataform::class, ['id' => $id])
            ->with(['games', 'plataforms_games'])
            ->fetchRecord();
        return $response->withJson($plataform, 200);
    }

    public function getListOfPlataforms(Request $request, Response $response, array $args)
    {
        $plataforms = $this->atlas->select(Plataform::class)->fetchRecords();
        return $response->withJson($plataforms, 200);
    }
}
