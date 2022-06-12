<?php
/**
 * File: HealthComponent.php
 * Purpose: health general DTO model.
 * DB Access: No
 * Uses files:
 *  - NONE
 * Used from:
 *  - src\controllers\HealthController.php
 */
namespace src\domain\dto\health;

/**
 * This object represents a Health Status DTO.
 * @property String $status the status string representation, by default 'UP', can be: 'DOWN' or 'UP'.
 * @property Map $components is an Map of HealthComponents with their identifiers.
 * @property Map $details is an map of String key to value.
 * @see HealthComponent
 */
class HealthStatus {
    public $status;

    /**
     * Create a new instance of this object.
     * @param String $status 'UP' or 'DOWN', defaults is 'UP'
     */
    public function __construct($status = 'UP') {
        $this->status = $status;
    }

    /**
     * Changes the Component status,
     * can be: 'DOWN' or 'UP'.
     * @param String $status 'UP' or 'DOWN'
     */
    public function setStatus($status): void {
        $this->status = $status;
    }

    /**
     * Returns the component status.
     * @return String the component status.
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * Changes the identified key value from components map.
     * @param mixed $key the identifier key.
     * @param mixed $data the components identified by key.
     */
    public function setComponent($key, $data): void {
        if (!isset($this->components)) {
            $this->components = [];
        }
        $this->components[$key] = $data;
    }

    /**
     * Returns the components map.
     * @return String the components map.
     */
    public function getComponents() {
        return $this->components;
    }

    /**
     * Changes the identified key value from details map.
     * @param mixed $key the identifier key.
     * @param mixed $data the data identified by key.
     */
    public function setDetail($key, $data): void {
        if (!isset($this->details)) {
            $this->details = [];
        }
        $this->details[$key] = $data;
    }

    /**
     * Returns the details map.
     * @return String the details map.
     */
    public function getDetails() {
        return $this->details;
    }
}