<?php
/**
 * File: BaseController.php
 * Purpose: Perform basic operations on the database of those classes that extend from it.
 * DB Access: Yes
 * Uses files:
 *  - src\libraries\LogManager.php
 *  - src\domain\AssetsManager.php
 *  - src\domain\providers\AtlasProvider.php
 *  - src\domain\providers\DatabaseProvider.php
 *  - src\domain\dto\JsonResponse.php
 * Used from:
 *  - HealthController.php
 *  - InsertController.php
 *  - SelectController.php
 *  - SessionController.php
 *  - UpdateController.php
 */
namespace src\controllers;

use PDO;
use Exception;
use Monolog\Logger;
use Slim\Http\Response;
use Atlas\Orm\Atlas;
use src\domain\AssetsManager;
use src\domain\providers\AtlasProvider;
use src\domain\providers\DatabaseProvider;
use src\domain\dto\JsonResponse;
use src\libraries\LogManager;

/**
 * Is the abstract controller, used for generic operations, 
 * and from which all controllers should extends.
 */
class BaseController
{
    /**
     * The log manager.
     * @var LogManager $logger
     * @see LogManager
     */
    protected LogManager $logger;

    /**
     * The PDO object connection.
     * @var PDO $db
     * @see PDO
     */
    protected PDO $db;

    /**
     * The Atlas librarie instance.
     * @var Atlas $atlas
     * @see Atlas
     */
    protected Atlas $atlas;

    /**
     * This is the result code used to create the JSONResponse.
     * @var mixed $resultCode
     * @see JsonResponse
     */
    protected $resultCode = 200;

    /**
     * This is the result message used to create the JSONResponse.
     * @var mixed $resultMessage
     * @see JsonResponse
     */
    protected $resultMessage = 'OK';

    /**
     * Creates an instance of this controller
     * @param Class $clazz the class used for the logger.
     * @see LogManager
     */
    public function __construct($clazz = BaseController::class) {
        $this->logger = new LogManager($clazz);
        $this->db = DatabaseProvider::getInstance();
        $this->atlas = AtlasProvider::getInstance();
    }

    /**
     * Used to save a uploaded media (images and videos) for a $type object.
     * @param String $base64_string is the file data in base64,
     * @param String $filename the name of the file that will have the file in the system.
     * @param String $type specifies the type of object to which it belongs, only allowed 'games' and 'plataforms'.
     */
    protected function uploadImage($base64_string, $filename, $type = 'games'): void
    {
        $data = explode(',', $base64_string);
        $path = $_SERVER['APP_BASE_PATH'] . "/assets/images/$type/";
        AssetsManager::getInstance()->writeAssets($path, $filename, base64_decode($data[1]));
    }

    /**
     * makes the rollback operation when the chill needs.
     * @param mixed $id used to determine if an object has been modified in the database.
     * @param String $clazz the object classname that wants to rollback.
     * @param Array $conditions the conditions to find the object that want to be removed while rollback.
     * @param Array $with relations of the object in the database to remove while rollback.
     */
    protected function rollback($id, $clazz, Array $conditions, Array $with = []): void
    {
        $this->atlas->rollBack();
        if ($id !== null) {
            $toDelete = $this->atlas->select($clazz, $conditions)->with($with)->fetchRecord();
            if ($toDelete !== null) $this->atlas->delete($toDelete);
        }
    }

    /**
     * Process a exception in order to create a response
     * for the client that adapts to said exception.
     * @param Exception $ex the exception
     * @param int $status the response status (optional)
     */
    protected function processException(Exception $ex, $status = 400): void
    {
        $this->logger->log($ex->getMessage(), Logger::ERROR);
        $this->resultCode = $status;
        $this->resultMessage = $ex->getMessage();
    }

    /**
     * Used when you want the response to be a "try again later".
     * @param Exception $ex the exception.
     */
    protected function tryItMoreLater(Exception $ex): void 
    {
        $this->logger->log($ex->getMessage(), Logger::ERROR);
        $this->resultCode = 502;
        $this->resultMessage = "This action could not be completed, please try again later.";
    }

    /**
     * Creates a json response using the $resultCode and $resultMessage properties.
     * @param Response $response the response to edit.
     */
    protected function createJsonResponseMessage(Response $response): Response
    {
        $messageObject = new JsonResponse($this->resultCode, $this->resultMessage);
        return $response->withJson($messageObject, 200);
    }
}
