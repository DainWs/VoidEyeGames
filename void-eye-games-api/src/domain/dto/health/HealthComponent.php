<?php

namespace src\domain\dto\health;

/**
 * This object represents a Health Component DTO
 */
class HealthComponent {
    public $status;
    public $details;

    /**
     * @param String $status 'UP' or 'DOWN', defaults is 'UP'
     */
    public function __construct($status = 'UP') {
        $this->status = $status;
        $this->details = [];
    }

    public function setStatus($status): void {
        $this->status = $status;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setDetail($key, $data): void {
        $this->details[$key] = $data;
    }

    public function getDetails() {
        return $this->details;
    }
}