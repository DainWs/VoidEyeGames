<?php
/**
 * File: UpdateController.php
 * Purpose: Perform database user update operations.
 * DB Access: Yes
 * Uses files:
 *  - src\controllers\BaseController.php
 *  - classes\Game\Game.php
 *  - classes\Category\Category.php
 *  - classes\Plataform\Plataform.php
 * Used from:
 *  - index.php
 */
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

/**
 * Used to manage the update data operations request
 */
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
            $src = $mainImage['src'] ?? null;
            $mediaType = $mainImage['mediaType'] ?? null;
            if ($mainImage !== null && $src !== null && $mediaType !== null) {
                if (preg_match('/.*image.*/', $mediaType) ) {
                    $recordid = $record->id;
                    $this->uploadImage($src, "game-$recordid.png", 'games');
                }
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
            $this->logger->log("[POST] : " . json_encode($category));
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
            $src = $mainImage['src'] ?? null;
            $mediaType = $mainImage['mediaType'] ?? null;
            if ($mainImage !== null && $src !== null && $mediaType !== null) {
                if (preg_match('/.*image.*/', $mediaType) ) {
                    $recordid = $record->id;
                    $this->uploadImage($src, "plataform-$recordid.png", 'plataforms');
                }
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
