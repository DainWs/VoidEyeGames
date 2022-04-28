<?php

namespace src\libraries;

use Exception;
use Monolog\Logger;
use PHPMailer\PHPMailer\PHPMailer;

/**
 * This class manage the send email task
 */
class EmailManager {
    private const SMTP_HOST = 'smtp.gmail.com';
    private const SMTP_PORT = 465;
    private const SMTP_AUTH = true;
    private const SMTP_ENCRYPTION = PHPMailer::ENCRYPTION_SMTPS;
    private const USER_NAME = 'Void Eye Support';
    private const USER_EMAIL = 'void.eye.games@gmail.com';
    private const USER_PASSWORD = 'Hs%jEozB6&DLvSH^yW8KB7iNe@Uc%0bNi0pigPMnqaU0qU*jLV';
    
    private LogManager $logger;
    private PHPMailer $mailer;

    /**
     * In the constructor we prepare the configuration for PHPMailer
     */
    public function __construct() {
        $this->logger = new LogManager('EmailManager');
        $this->mailer = new PHPMailer(true);
        $this->mailer->isSMTP();
        $this->mailer->Host = SELF::SMTP_HOST;
        $this->mailer->Port = SELF::SMTP_PORT;
        $this->mailer->SMTPAuth = SELF::SMTP_AUTH;
        $this->mailer->SMTPSecure = SELF::SMTP_ENCRYPTION;

        $this->mailer->Username = SELF::USER_EMAIL;
        $this->mailer->Password = SELF::USER_PASSWORD;

        $this->mailer->setFrom(SELF::USER_EMAIL, SELF::USER_NAME);
    }

    public function send($report): void  {
        try {
            $selectedReason = $report['selectedReason'];
            $issue = $report['issue'];
            $description = $report['description'];
            $email = $report['email'];

            $this->logger->log("Send report.");
            $this->mailer->addAddress(SELF::USER_EMAIL, SELF::USER_NAME);
            $this->mailer->Subject = "User Report - $selectedReason";

            $body = "Motivo: $selectedReason<br/>" .
                    "Issue: $issue<br/>". 
                    "Email: $email<br/>" .  
                    "Description<br/><hr/><br/> $description<br/><hr/>";

            $this->mailer->isHTML(true);
            $this->mailer->Body = $body;
            $this->mailer->send();
        } catch(Exception $ex) {
            $this->logger->log("[Error] ".$ex->getMessage(), Logger::WARNING);
        }
    }
}