<?php

namespace src\controllers;

use Slim\Http\Request;
use Slim\Http\Response;
use classes\User\User;
use classes\Game\Game;
use classes\Comment\Comment;
use classes\Category\Category;
use classes\Plataform\Plataform;
use classes\Category\CategoryRecord;
use classes\Comment\CommentRecord;
use classes\Game\GameRecord;
use classes\Plataform\PlataformRecord;
use Exception;
use src\domain\exceptions\AppException;
use src\validators\CategoryValidator;
use src\validators\GameValidator;
use src\validators\PlataformValidator;

class InsertController extends BaseController
{
    public function __construct() {
        parent::__construct(InsertController::class);
    }

    //----------------------------------------------------------------------------------
    // GAMES SECTION
    //----------------------------------------------------------------------------------
    public function addGame(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] addGame called.");
        $gameId = null;
        try {
            $game = $request->getParsedBody()['data'] ?? null;
            $validator = new GameValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($game);
            if ($validator->hasErrors()) {
                throw new AppException(json_encode($validator->getErrors()));
            }
            
            $medias = $game['medias'] ?? [];
            $mainImage = $game['mainImage'] ?? null;
            $categoriesGames = $game['categories_games'] ?? [];
            $plataformsGames = $game['plataforms_games'] ?? [];
            $game['id'] = null;
            $game['categories'] = null;
            $game['plataforms'] = null;
            $game['mainImage'] = null;
            $game['medias'] = null;
            $game['comments'] = null;
            $game['categories_games'] = null;
            $game['plataforms_games'] = null;

            /** @var GameRecord $record */
            $record = $this->atlas->newRecord(Game::class, $game);
            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $gameId = $record->id;
            foreach ($medias as $value) $record->addMedia($value, $this->atlas);
            foreach ($categoriesGames as $value) $record->addCategoriesGames($value, $this->atlas);
            foreach ($plataformsGames as $value) $record->addPlataformsGames($value, $this->atlas);

            $recordName = $record->name;
            $mainImageName = preg_replace('/[\s]+/', '_', $recordName);
            $this->uploadImage($mainImage['src'], $mainImageName . '.png', 'games');

            $this->atlas->persist($record);
            $this->atlas->commit();

            $this->logger->log("[POST] addGame was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->rollback($gameId, Game::class, ['id' => $gameId], ['medias', 'comments', 'categories_games', 'plataforms_games']);
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->rollback($gameId, Game::class, ['id' => $gameId], ['medias', 'comments', 'categories_games', 'plataforms_games']);
            $this->tryItMoreLater($ex);
        } 
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // CATEGORY SECTION
    //----------------------------------------------------------------------------------
    public function addCategory(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] addCategory called.");
        $categoryId = null;
        try {
            $category = $request->getParsedBody()['data'] ?? null;

            $validator = new CategoryValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($category);
            if ($validator->hasErrors()) {
                throw new AppException(json_encode($validator->getErrors()));
            }

            $categoriesGames = $category['categories_games'];
            $category['id'] = null;
            $category['games'] = null;
            $category['categories_games'] = null;
            
            /** @var CategoryRecord $record */
            $record = $this->atlas->newRecord(Category::class, $category);

            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $categoryId = $record->id;
            foreach ($categoriesGames as $value) $record->addCategoryGame($value, $this->atlas);
            $this->atlas->persist($record);
            $this->atlas->commit();

            $this->logger->log("[POST] addCategory was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->rollback($categoryId, Category::class, ['id' => $categoryId], ['categories_games']);
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->rollback($categoryId, Category::class, ['id' => $categoryId], ['categories_games']);
            $this->tryItMoreLater($ex);
        } 
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // PLATAFORM SECTION
    //----------------------------------------------------------------------------------
    public function addPlataform(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] addPlataform called.");
        $plataformId = null;
        try {
            $plataforms = $request->getParsedBody()['data'] ?? null;
            $validator = new PlataformValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($plataforms);
            if ($validator->hasErrors()) {
                throw new AppException(json_encode($validator->getErrors()));
            }

            $mainImage = $plataforms['mainImage'] ?? null;
            $plataformsGames = $plataforms['plataforms_games'];
            $plataforms['id'] = null;
            $plataforms['mainImage'] = null;
            $plataforms['games'] = null;
            $plataforms['plataforms_games'] = null;

            /** @var PlataformRecord $record*/
            $record = $this->atlas->newRecord(Plataform::class, $plataforms);

            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $plataformId = $record->id;
            foreach ($plataformsGames as $value) $record->addPlataformGame($value, $this->atlas);

            $recordName = $record->name;
            $mainImageName = preg_replace('/[\s]+/', '_', $recordName);
            $this->uploadImage($mainImage['src'], $mainImageName . '.png', 'plataforms');

            $this->atlas->persist($record);
            $this->atlas->commit();

            $this->logger->log("[POST] addPlataform was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->rollback($plataformId, Plataform::class, ['id' => $plataformId], ['plataforms_games']);
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->rollback($plataformId, Plataform::class, ['id' => $plataformId], ['plataforms_games']);
            $this->tryItMoreLater($ex);
        } 
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // COMMENTS SECTION
    //----------------------------------------------------------------------------------
    public function addComment(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] addComment called.");
        try {
            $comment = $request->getParsedBody()['data'] ?? null;
            $user = $this->atlas->select(User::class, ['id' => $comment['usersId']])->fetchRecord();
            if ($user == null) throw new AppException('This user does not exist');
            
            $comment['id'] = null;
            $comment['usersId'] = $user->id;
            
            /** @var CommentRecord $record */
            $record = $this->atlas->newRecord(Comment::class, $comment);

            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $this->atlas->commit();

            $this->logger->log("[POST] addComment was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->atlas->rollBack();
            $this->tryItMoreLater($ex);
        } 
        return $this->createJsonResponseMessage($response);
    }
}
