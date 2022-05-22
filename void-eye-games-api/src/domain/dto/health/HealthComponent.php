<?php

namespace src\domain\dto\health;

class HealthComponent {
    public $status;
    public $details;

    /**
     * @param $status
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