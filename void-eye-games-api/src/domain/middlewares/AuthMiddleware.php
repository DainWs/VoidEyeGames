<?php
/**
 * File: AuthMiddleware.php
 * Purpose: Middleware used for credentials checks, so if someone who does
 * not have enough permissions tries to access it, it will not let him.
 * DB Access: No
 * Uses files:
 *  - src\domain\AuthManager.php
 *  - src\domain\dto\JsonResponse.php
 *  - src\libraries\LogManager.php
 * Used from:
 *  - Index.php
 */
namespace src\domain\middlewares;

use Exception;
use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\AuthManager;
use src\domain\dto\JsonResponse;
use src\libraries\LogManager;

/**
 * This middleware has the task of intercepting the requests
 * that require permissions, and depending on the permissions
 * that the user has, allow him to perform the action or not.
 */
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

    /**
     * Validate credentials, too see if the saved ones are the same as coming ones.
     * @param $credentials array of credentials data.
     */
    private function validateCredentials(?Array $credentials): void {
        if ($credentials == null) throw new Exception('Not Allowed');
        $authManager = new AuthManager();
        $areValid = $authManager->validate($credentials);
        if (!$areValid) throw new Exception('Not Allowed');
    }

    /**
     * validate the users credentials permision level is the minimun to realice this operation.
     * @param $credentials the credentials to check.
     */
    private function validateRequiredLevel(?Array $credentials): void {
        if ($credentials == null) throw new Exception('Not Allowed');
        $accountType = $credentials['accountType'];
        $areValid = $accountType <= $this->requiredAccountLevel;
        if (!$areValid) throw new Exception('Not Allowed');
    }

    /**
     * create the "Not allowed" response.
     * @return Response
     */
    private function getNotAllowedResponse(Response $response): Response {
        return $response->withJson(new JsonResponse(403, 'Not Allowed'), 200);
    }
}