<?php

namespace src\libraries;

use Exception;
use Monolog\Logger;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/**
 * This class manage the send email task
 */
class EmailManager {
    private const SMTP_HOST = 'smtp.gmail.com';
    private const SMTP_PORT = 465;
    private const SMTP_AUTH = true;
    private const SMTP_ENCRYPTION = PHPMailer::ENCRYPTION_SMTPS;
    private const USER_NAME = 'Void Eye Support';
    private const USER_EMAIL = 'dm9pZC5leWUuZ2FtZXNAZ21haWwuY29t';
    private const USER_PASSWORD = 'SHMlakVvekI2JkRMdlNIXnlXOEtCN2lOZUBVYyUwYk5pMHBpZ1BNbnFhVTBxVSpqTFY=';
    
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

        $this->mailer->Username = base64_decode(SELF::USER_EMAIL);
        $this->mailer->Password = base64_decode(SELF::USER_PASSWORD);

        $this->mailer->setFrom(base64_decode(SELF::USER_EMAIL), SELF::USER_NAME);
    }

    /**
     * Check the smtp connection and authentication
     */
    public function check(): bool
    {
        $result = false;
        $smtp = new SMTP();
        try {
            if (!$smtp->connect(SELF::SMTP_HOST, SELF::SMTP_PORT)) {
                throw new Exception('Connect failed');
            }

            if (!$smtp->hello(gethostname())) {
                throw new Exception('EHLO failed: ' . $smtp->getError()['error']);
            }
            
            $username = base64_decode(SELF::USER_EMAIL);
            $secret = base64_decode(SELF::USER_PASSWORD);
            if ($smtp->authenticate($username, $secret)) {
                $result = true;
            }
        } catch (Exception $ex) {
            $this->logger->log("[Error] SMTP: ".$ex->getMessage(), Logger::WARNING);
        }
        $smtp->quit();
        return $result;
    }

    public function send($report): void  {
        try {
            $selectedReason = $report['reason'];
            $issue = $report['issue'];
            $description = $report['description'];
            $email = $report['email'];

            $this->logger->log("Send report.");
            $this->mailer->addAddress(base64_decode(SELF::USER_EMAIL), SELF::USER_NAME);
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