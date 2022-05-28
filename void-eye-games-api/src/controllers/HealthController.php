<?php

namespace src\controllers;

use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\dto\health\HealthComponent;
use src\domain\dto\health\HealthStatus;

class HealthController extends BaseController
{
    public function __construct() {
        parent::__construct(HealthController::class);
    }

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

    private function checkLogger(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->logger));
        $status->setComponent('library.logger', $component);
    }
    
    private function checkDatabase(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->db));
        $component->setDetail('type', 'mysql');
        $status->setComponent('service.database', $component);
    }

    private function checkAtlas(HealthStatus $status): void
    {
        $component = new HealthComponent($this->checkBasic($this->atlas));
        $status->setComponent('service.atlas', $component);
    }

    private function checkMailer(HealthStatus $status): void
    {
        $mailStatus = $this->checkBasic((new \src\libraries\EmailManager())->check());
        $component = new HealthComponent($mailStatus);
        $status->setComponent('library.mailer', $component);
    }

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

    private function addTableCountDetails(HealthStatus $status, $key, $tableClass): void
    {
        $count = $this->atlas->select($tableClass)->fetchCount();
        $status->setDetail("table.$key.count", $count);
    }

    private function checkBasic($object): String
    {
        return ($object) ? 'UP' : 'DOWN';
    }
}
