<?php

namespace src\domain;
use Slim\Http\Request;
use Slim\Http\Response;
use src\domain\dto\Credentials;

class AuthMiddleware {
    public function __invoke(Request $request, Response $response, $next){
        $body = $request->getParsedBody();
        if ($body == null || !$body['credentials']) {
            return $response->withJson('{"code": 403, "message":"Not Allowed"}', 403);
        }
        $credentials = $body['credentials'];

        $authentifier = new JWTManager();
        $result = $authentifier->validate(new Credentials($credentials));
        if (!$result) {
            return $response->withJson('{"code": 403, "message":"Not Allowed"}', 403);
        }

        return $next($request, $response);
    }
}