<?php

namespace src\domain\dto\health;

class HealthStatus {
    public $status;

    /**
     * @param $status
     */
    public function __construct($status = 'UP') {
        $this->status = $status;
    }

    public function setStatus($status): void {
        $this->status = $status;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setComponent($key, $data): void {
        if (!isset($this->components)) {
            $this->components = [];
        }
        $this->components[$key] = $data;
    }

    public function getComponents() {
        return $this->components;
    }

    public function setDetail($key, $data): void {
        if (!isset($this->details)) {
            $this->details = [];
        }
        $this->details[$key] = $data;
    }

    public function getDetails() {
        return $this->details;
    }
}