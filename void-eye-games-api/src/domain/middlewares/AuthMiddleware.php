<?php

namespace src\domain\middlewares;

use Exception;
use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\AuthManager;
use src\domain\dto\JsonResponse;
use src\libraries\LogManager;

class AuthMiddleware {
    private int $requiredAccountLevel;
    private LogManager $logger;

    public function __construct(int $requiredAccountLevel = ACCOUNT_TYPE_UNKNOWN) {
        $this->requiredAccountLevel = $requiredAccountLevel;
        $this->logger = new LogManager(AuthMiddleware::class);
    }

    public function __invoke(Request $request, Response $response, $next){
        try {
            $body = $request->getParsedBody();
            $credentials = $body['credentials'] ?? null;
            $this->validateCredentials($credentials);
            $this->validateRequiredLevel($credentials);
            return $next($request, $response);
        } catch (Exception $ex) {
            $this->logger->log('Error validating credentials, error message: ' . $ex->getMessage());
            return $this->getNotAllowedResponse($response);
        }
    }

    private function validateCredentials(?Array $credentials): void {
        if ($credentials == null) throw new Exception('Not Allowed');
        $authManager = new AuthManager();
        $areValid = $authManager->validate($credentials);
        if (!$areValid) throw new Exception('Not Allowed');
    }

    private function validateRequiredLevel(?Array $credentials): void {
        if ($credentials == null) throw new Exception('Not Allowed');
        $accountType = $credentials['accountType'];
        $areValid = $accountType <= $this->requiredAccountLevel;
        if (!$areValid) throw new Exception('Not Allowed');
    }

    private function getNotAllowedResponse(Response $response): Response {
        return $response->withJson(new JsonResponse(403, 'Not Allowed'), 200);
    }
}