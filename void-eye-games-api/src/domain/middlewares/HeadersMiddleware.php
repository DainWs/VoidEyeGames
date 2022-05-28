<?php

namespace src\domain\middlewares;

/**
 * This middleware has the task of intercepting the responses
 * and allow all Origins and Headers.
 * 
 * This middleware is required for API works in some cases.
 */
class HeadersMiddleware {
    public function __invoke($request, $response, $next){
        $response = $next($request, $response);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', '*')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    }
}