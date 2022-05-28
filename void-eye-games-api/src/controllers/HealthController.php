<?php

namespace src\controllers;

use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\dto\health\HealthComponent;
use src\domain\dto\health\HealthStatus;

/**
 * Used for services/components/libraries server status check.
 */
class HealthController extends BaseController
{
    public function __construct() {
        parent::__construct(HealthController::class);
    }

    /**
     * request the health status.
     */
    public function health(Request $request, Response $response, array $args)
    {
        $showComponents = $request->getParam('showComponents', false);
        $showLibraries = $request->getParam('showLibraries', false);
        $showDetails = $request->getParam('showDetails', false);
        
        $status = new HealthStatus('UP');
        if ($showComponents) {
            $this->checkDatabase($status);
            $this->checkAtlas($status);

            if ($showLibraries) {
                $this->checkLogger($status);
                $this->checkMailer($status);
            }
        }

        if ($showDetails) {
            $this->checkExtras($status);
        }

        return $response->withJson($status, 200);
    }

    /**
     *  Check the Database status.
     *  @param HealthStatus $status the status object
     */
    private function checkLogger(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->logger));
        $status->setComponent('library.logger', $component);
    }
    
    /**
     *  Check the Database status.
     *  @param HealthStatus $status the status object
     */
    private function checkDatabase(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->db));
        $component->setDetail('type', 'mysql');
        $status->setComponent('service.database', $component);
    }

    /**
     *  Check the Atlas status.
     *  @param HealthStatus $status the status object
     */
    private function checkAtlas(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->atlas));
        $status->setComponent('service.atlas', $component);
    }

    /**
     *  Check the SMTP mailer connection status.
     *  @param HealthStatus $status the status object
     */
    private function checkMailer(HealthStatus $status): void
    {
        $mailStatus = $this->checkBasic((new \src\libraries\EmailManager())->check());
        $component = new HealthComponent($mailStatus);
        $status->setComponent('library.mailer', $component);
    }

    /**
     * Check the status of extras, and add then to the status object
     * @param HealthStatus $status the status object
     */
    private function checkExtras(HealthStatus $status): void
    {
        if ($this->atlas != null) {
            $this->addTableCountDetails($status, 'users', \classes\User\User::class);
            $this->addTableCountDetails($status, 'categories', \classes\Category\Category::class);
            $this->addTableCountDetails($status, 'plataforms', \classes\Plataform\Plataform::class);
            $this->addTableCountDetails($status, 'games', \classes\PlataformsGame\PlataformsGame::class);
        }
        $status->setDetail('table.games.limit-per-page', QUERY_GAMES_PER_PAGE);
    }

    /**
     * Add the table count details for the specified table.
     * @param HealthStatus $status the status object to edit.
     * @param String $key the identifier key for the detail.
     * @param String $tableClass the table classname.
     */
    private function addTableCountDetails(HealthStatus $status, $key, $tableClass): void
    {
        $count = $this->atlas->select($tableClass)->fetchCount();
        $status->setDetail("table.$key.count", $count);
    }

    /**
     * Check if a object is null or undefined, in this case, the method return 'DOWN'.
     * @param $object the object tu check.
     * @return 'UP' if was successfull, 'DOWN' otherwise.
     */
    private function checkBasic($object): String
    {
        return ($object) ? 'UP' : 'DOWN';
    }
}
