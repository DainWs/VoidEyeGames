<?php

namespace src\domain\dto;

class JsonResponse {
    private int|string $status;
    private Object $body;

    /**
     * @param ?int|string $status
     * @param ?Object $body
     */
    public function __construct($status = 200, $body = 'Ok') {
        $this->status = $status;
        $this->body = $body;
    }

    public function setStatus($status): void {
        $this->status = $status;
    }

    public function getStatus(): String {
        return $this->status;
    }

    public function setBody($body): void {
        $this->body = $body;
    }

    public function getBody(): Object {
        return $this->body;
    }
}