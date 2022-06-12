<?php
/**
 * File: Credentials.php
 * Purpose: Credentials general DTO model.
 * DB Access: No
 * Uses files:
 *  - NONE
 * Used from:
 *  - src\controllers\BaseController.php
 */
namespace src\domain\dto;

/**
 * This class represents the JSON Response DTO object.
 */
class JsonResponse {
    /**
     * The response status.
     * @var mixed $status
     */
    public $status;

    /**
     * The response body.
     * @var mixed $body
     */
    public $body;

    /**
     * Create an instance of this class.
     * @param $status the response status, by default: 200
     * @param $body the response body, by default: Ok
     */
    public function __construct($status = 200, $body = 'Ok') {
        $this->status = $status;
        $this->body = $body;
    }

    /**
     * Changes the response status.
     * @param mixed $status the response status
     */
    public function setStatus($status): void {
        $this->status = $status;
    }

    /**
     * Returns the response status.
     * @return mixed the response status.
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * Changes the response body.
     * @param mixed $body the response body
     */
    public function setBody($body): void {
        $this->body = $body;
    }

    /**
     * Returns the response body.
     * @return mixed the response body.
     */
    public function getBody() {
        return $this->body;
    }
}