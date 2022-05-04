<?php

namespace src\domain\dto;

class JsonResponse {
    public $status;
    public $body;

    /**
     * @param $status
     * @param $body
     */
    public function __construct($status = 200, $body = 'Ok') {
        $this->status = $status;
        $this->body = $body;
    }

    public function setStatus($status): void {
        $this->status = $status;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setBody($body): void {
        $this->body = $body;
    }

    public function getBody() {
        return $this->body;
    }
}