<?php

namespace src\controllers;

use PDO;
use Exception;
use Monolog\Logger;
use Slim\Http\Response;
use Atlas\Orm\Atlas;
use classes\Media\Media;
use classes\Game\GameRecord;
use classes\Media\MediaRecord;
use src\domain\AssetsManager;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
use src\domain\dto\JsonResponse;
use src\libraries\LogManager;

class BaseController
{
    protected LogManager $logger;
    protected PDO $db;
    protected Atlas $atlas;

    protected $resultCode = 200;
    protected $resultMessage = 'OK';

    public function __construct($clazz = BaseController::class) {
        $this->logger = new LogManager($clazz);
        $this->db = DatabaseProvider::getInstance();
        $this->atlas = AtlasProvider::getInstance();
    }

    /**
     * @param GameRecord $gameRecord
     */
    protected function getMediaRecord($mediaArray, $gameRecord): ?MediaRecord
    {
        $src = $mediaArray['src'];
        $mediaArray['src'] = null;
        $mediaArray['id'] = null;
        $mediaArray['gamesId'] = $gameRecord->id;
        /** @var MediaRecord $media */
        $media = $this->atlas->newRecord(Media::class, $mediaArray);
        $extension = substr($media->mediaType, strpos($media->mediaType, '/'));
        $filename = $gameRecord->id . '-' . $media->id . ".$extension";
        $this->uploadImage($src, $filename);
        return $media;
    }

    protected function uploadImage($base64_string, $filename, $type = 'games')
    {
        $data = explode(',', $base64_string);
        $path = $_SERVER['APP_BASE_PATH'] . "/assets/images/$type/";
        AssetsManager::getInstance()->writeAssets($path, $filename, base64_decode($data[1]));
    }

    protected function rollback($id, $clazz, Array $conditions, Array $with = [])
    {
        $this->atlas->rollBack();
        if ($id !== null) {
            $toDelete = $this->atlas->select($clazz, $conditions)->with($with)->fetchRecord();
            if ($toDelete !== null) $this->atlas->delete($toDelete);
        }
    }

    protected function processException(Exception $ex, $status = 400)
    {
        $this->logger->log($ex->getMessage(), Logger::ERROR);
        $this->resultCode = $status;
        $this->resultMessage = $ex->getMessage();
    }

    protected function tryItMoreLater(Exception $ex): void {
        $this->logger->log($ex->getMessage(), Logger::ERROR);
        $this->resultCode = 502;
        $this->resultMessage = "This action could not be completed, please try again later.";
    }

    protected function createJsonResponseMessage(Response $response)
    {
        $messageObject = new JsonResponse($this->resultCode, $this->resultMessage);
        return $response->withJson($messageObject, 200);
    }
}
