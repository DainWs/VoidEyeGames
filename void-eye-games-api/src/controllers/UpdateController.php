<?php

namespace src\controllers;

use Exception;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\Game\Game;
use classes\Category\Category;
use classes\Plataform\Plataform;
use classes\Category\CategoryRecord;
use classes\Game\GameRecord;
use classes\Plataform\PlataformRecord;
use src\domain\exceptions\AppException;

class UpdateController extends BaseController
{
    public function __construct() {
        parent::__construct(UpdateController::class);
    }

    //----------------------------------------------------------------------------------
    // GAMES SECTION
    //----------------------------------------------------------------------------------
    public function updateGame(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] updateGame called.");
        try {
            $game = $request->getParsedBody()['data'] ?? null;
            /** @var GameRecord $record */
            $record = $this->atlas->select(Game::class, ['id' => $game['id']])
                ->with(['medias', 'plataforms_games', 'categories_games'])
                ->fetchRecord();
            
            if ($record == null) throw new AppException('This game does not exist');
            $record->update($game, $this->atlas);
            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();
            
            $mainImage = $game['mainImage'] ?? null;
            if ($mainImage !== null && $mainImage['src'] !== null) {
                $mainImageName = preg_replace('/[\s]+/', '_', $record->name);
                $this->uploadImage($mainImage['src'], $mainImageName . '.png', 'games');
            }
            $this->logger->log("[POST] updateGame was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->atlas->rollBack();
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // CATEGORY SECTION
    //----------------------------------------------------------------------------------
    public function updateCategory(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] updateCategory called.");
        try {
            $category = $request->getParsedBody()['data'] ?? null;
            /** @var CategoryRecord $record */
            $record = $this->atlas->select(Category::class, ['id' => $category['id']])
                ->with(['categories_games'])
                ->fetchRecord();
            
            if ($record == null) throw new AppException('This category does not exist');
            $record->update($category, $this->atlas);
            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();

            $this->logger->log("[POST] updateCategory was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch (AppException $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        } catch(Exception $ex) {
            $this->atlas->rollBack();
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // PLATAFORMS SECTION
    //----------------------------------------------------------------------------------
    public function updatePlataform(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] updatePlataform called.");
        try {
            $plataform = $request->getParsedBody()['data'] ?? null;
            /** @var PlataformRecord $record */
            $record = $this->atlas->select(Plataform::class, ['id' => $plataform['id']])
                ->with(['plataforms_games'])
                ->fetchRecord();

            if ($record == null) throw new AppException('This plataform does not exist');
            $record->update($plataform, $this->atlas);
            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();
            
            $mainImage = $game['mainImage'] ?? null;
            if ($mainImage !== null && $mainImage['src'] !== null) {
                $mainImageName = preg_replace('/[\s]+/', '_', $record->name);
                $this->uploadImage($mainImage['src'], $mainImageName . '.png', 'plataforms');
            }
            $this->logger->log("[POST] updatePlataform was successfully. object : " . json_encode($record->jsonSerialize()));
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
