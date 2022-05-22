<?php

namespace src\controllers;

use Exception;
use Monolog\Logger;
use Slim\Http\Request;
use Slim\Http\Response;
use classes\User\User;
use classes\User\UserRecord;
use src\domain\AuthManager;
use src\domain\dto\JsonResponse;
use src\domain\exceptions\AppException;
use src\libraries\EmailManager;
use src\validators\SignUserValidator;

class SessionController extends BaseController
{
    public function __construct() {
        parent::__construct(SessionController::class);
    }

    //----------------------------------------------------------------------------------
    // SESSIONS SECTION
    //----------------------------------------------------------------------------------
    public function signIn(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] signIn called.");
        try {
            $user = $request->getParsedBody()['data'] ?? null;
            $validator = new SignUserValidator();
            $validator->setAtlas($this->atlas);
            $validator->validate($user);
            if ($validator->hasErrors()) {
                $jsonResponse = new JsonResponse(400, $validator->getErrors());
                return $response->withJson($jsonResponse, 200);
            }

            /** @var UserRecord $record */
            $record = $this->atlas->newRecord(User::class, $user);
            $record->accountType = ACCOUNT_TYPE_LOGGED_USER;
            $this->atlas->beginTransaction();
            $this->atlas->insert($record);
            $this->atlas->commit();

            $credentials = (new AuthManager())->registre($user['name'], $record->accountType);
            $this->resultMessage = $credentials;
            $this->logger->log("[POST] signIn was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch(AppException $ex) {
            $this->atlas->rollBack();
            $this->processException($ex);
        } catch (Exception $ex) {
            $this->atlas->rollBack();
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    public function logIn(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] logIn called. ");
        try {
            $user = $request->getParsedBody()['data'] ?? null;
            $username = $user['username'] ?? null;
            $password = $user['password'] ?? null;
            if ($username === null || $password === null) {
                throw new AppException('Ivalid Username or Password.');
            }

            $record = $this->atlas->select(User::class, ['name' => $username])->fetchRecord();
            if ($record === null) throw new AppException('That user does not exist');
            if ($record->password !== $password) throw new AppException('Ivalid Username or Password.');
            
            $credentials = (new AuthManager())->registre($record->name, $record->accountType);
            $this->resultMessage = $credentials;
            $this->logger->log("[POST] logIn was successfully. object : " . json_encode($record->jsonSerialize()));
        } catch(AppException $ex) {
            $this->processException($ex, 403);
        } catch (Exception $ex) {
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    //----------------------------------------------------------------------------------
    // REPORTS SECTION
    //----------------------------------------------------------------------------------
    public function sendReport(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] sendReport called.");
        try {
            $report = $request->getParsedBody()['data'] ?? null;
            if (($report['reason'] ?? null)==null) throw new AppException('The reason is required.');
            if (($report['issue'] ?? null)==null) throw new AppException('The issue is required.');
            if (($report['description'] ?? null)==null) throw new AppException('The description is required.');
            if (($report['email'] ?? null)==null) throw new AppException('The email is required.');
            if (($report['terms'] ?? null)==null || $report['terms'] !== true) throw new AppException('Accept the terms to continue.');

            $mailSender = new EmailManager();
            $mailSender->send($report);
            $this->logger->log("[POST] sendReport was successfully. object : " . json_encode($report));
        } catch(AppException $ex) {
            $this->processException($ex);
        } catch (Exception $ex) {
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }

    public function sendRecovery(Request $request, Response $response, array $args)
    {
        $this->logger->log("[POST] sendReport called.");
        try {
            $report = $request->getParsedBody()['data'] ?? null;
            if (($report['email'] ?? null)==null) throw new AppException('The email is required.');
            
            $record = $this->atlas->select(User::class, ['email' => $report['email']])->fetchRecord();
            
            if ($record == null) throw new AppException('No user with this email was found.');

            $newPassword = bin2hex(openssl_random_pseudo_bytes(6));
            $record->password = md5($newPassword);

            $this->atlas->beginTransaction();
            $this->atlas->persist($record);
            $this->atlas->commit();

            $mailSender = new EmailManager();
            $mailSender->sendRecovery($record->email, $newPassword);
            $this->logger->log("[POST] sendRecovery was successfully. object : " . json_encode($report));
        } catch(AppException $ex) {
            $this->processException($ex);
        } catch (Exception $ex) {
            $this->tryItMoreLater($ex);
        }
        return $this->createJsonResponseMessage($response);
    }
}
