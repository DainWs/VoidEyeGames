<?php

namespace src\domain;

class AuthMiddleware {
    public function __invoke($request, $response, $next){
        $body = json_decode($response->getBody());
        if ($body == null || !$body->credentials) {
            return $response->withJson('{"code": 403, "message":"Not Allowed"}', 403);
        }
        $credentials = $body->credentials;

        $authentifier = new JWTManager();
        $result = $authentifier->validate($credentials);
        if (!$result) {
            return $response->withJson('{"code": 403, "message":"Not Allowed"}', 403);
        }

        return $next($request, $response);
    }
}