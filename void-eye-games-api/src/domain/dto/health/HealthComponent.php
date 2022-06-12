<?php
/**
 * File: HealthComponent.php
 * Purpose: health component/service DTO model.
 * DB Access: No
 * Uses files:
 *  - NONE
 * Used from:
 *  - src\controllers\HealthController.php
 */
namespace src\domain\dto\health;

/**
 * This object represents a Health Component DTO.
 * @property String $status the status string representation, by default 'UP', can be: 'DOWN' or 'UP'.
 * @property Map $details is an map of String key to value.
 */
class HealthComponent {
    public $status;

    /**
     * Create a new instance of this object.
     * @param String $status 'UP' or 'DOWN', defaults is 'UP'
     */
    public function __construct($status = 'UP') {
        $this->status = $status;
        $this->details = [];
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
     * Changes the identified key value from details map.
     * @param mixed $key the identifier key.
     * @param mixed $data the data identified by key.
     */
    public function setDetail($key, $data): void {
        $this->details[$key] = $data;
    }

    /**
     * Returns the component details map.
     * @return String the component details map.
     */
    public function getDetails() {
        return $this->details;
    }
}