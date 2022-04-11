<?php

namespace src\libraries;

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

/**
 * This class is the main class in charge of recording logs into /logs/ folder
 */
class LogManager {
    private Logger $logger;
    private StreamHandler $handler;

    /**
     * Create a specific class log manager
     * @param $class the specific class for this logger
     */
    public function __construct(String $class) {
        $this->logger = new Logger("[$class]");
        $this->handler = new StreamHandler($this->getFile(), Logger::DEBUG);

        $this->logger->pushHandler($this->handler);
    }

    /**
     * do a record of a $message with the specified severity $level
     * @param String $message is the message/text that you want to record in the log file.
     * @param $level is the severity level for this log message.
     */
    public function log(String $message, $level = Logger::DEBUG): void {
        $this->logger->log($level, '['.((session_id()) ? session_id() : 'UNKNOWN')."] $message");
    }

    /**
     * get the today's log file.
     * @return String the file in which the messages will be saved
     */
    private function getFile(): string {
        return $_SERVER['APP_BASE_PATH'].'/logs/'.date('d-m-Y').'.log';
    }
}