<?php
/**
 * File: EmailManager.php
 * Purpose: Used to send emails, so, this is the class that
 * sends reports and recovery password emails.
 * DB Access: No
 * Uses files:
 *  - src\domain\exceptions\AppException.php
 * Used from:
 *  - src\controllers\SessionController.php
 */
namespace src\libraries;

use Exception;
use Monolog\Logger;
use PHPMailer\PHPMailer\PHPMailer;
use src\domain\exceptions\AppException;

/**
 * This class manage the send email task
 */
class EmailManager {
    private const SMTP_HOST = 'smtp.office365.com';
    private const SMTP_PORT = 587;
    private const SMTP_AUTH = true;
    private const SMTP_ENCRYPTION = PHPMailer::ENCRYPTION_STARTTLS;
    private const USER_NAME = 'Void Eye Support';
    private const USER_EMAIL = 'dm9pZC5leWUuZ2FtZXNAaG90bWFpbC5jb20=';
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
        $smtp = null;
        try {
            if (!$this->mailer->smtpConnect()) {
                throw new AppException('Connect failed');
            }

            $smtp = $this->mailer->getSMTPInstance();
            if (!$smtp->hello(gethostname())) {
                throw new AppException('EHLO failed: ' . $smtp->getError()['error']);
            }

            $result = true;
        } catch (Exception $ex) {
            $this->logger->log("[Error] SMTP: ".$ex->getMessage(), Logger::WARNING);
        }
        if ($smtp) {
            $smtp->quit();
        }
        return $result;
    }

    /**
     * Sends a bug report
     * @param $report is the report DTO object represented as a Array
     */
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

    /**
     * Send the recovery password email, to the specific email.
     * @param String $email the destination mail.
     * @param String $newPassword the new password.
     */
    public function sendRecovery($email, $newPassword): void  {
        try {
            $this->logger->log("Send recovery.");

            $name = explode('@', $email);
            $this->mailer->addAddress($email, $name[0]);
            $this->mailer->Subject = "Void eye games - Recovery password.";
            $this->mailer->isHTML(true);
            $this->mailer->Body = "Buenos d&iacute;as, aqui tienes tu nueva contrase&ntilde;a generada: $newPassword";
            $this->mailer->send();
        } catch(Exception $ex) {
            $this->logger->log("[Error] ".$ex->getMessage(), Logger::WARNING);
        }
    }
}