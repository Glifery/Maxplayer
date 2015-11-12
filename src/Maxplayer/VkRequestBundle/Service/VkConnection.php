<?php

namespace Maxplayer\VkRequestBundle\Service;

use getjump\Vk\Core;
use Glifery\VkOAuthTokenBundle\Service\TokenManager;
use Symfony\Bridge\Monolog\Logger;

class VkConnection
{
    const API_VERSION = '5.40';

    /** @var TokenManager */
    private $tokenManager;

    /** @var Logger */
    private $logger;

    /** @var array */
    private $errors;

    /** @var Core */
    private $vkCore;

    /**
     * @param TokenManager $tokenManager
     * @param Logger $logger
     */
    public function __construct(TokenManager $tokenManager, Logger $logger)
    {
        $this->tokenManager = $tokenManager;
        $this->logger = $logger;
        $this->errors = array();

        $this->init();
    }

    private function init()
    {
        if (!$token = $this->tokenManager->getGlobalToken()) {
            $this->registerError('VK OAuth token doesn\'t exist.');
        }

        $this->vkCore = Core::getInstance()
            ->apiVersion(self::API_VERSION)
            ->setToken($token->getToken())
        ;
    }

    /**
     * @param string $methodName
     * @param array $params
     * @return array|null
     */
    public function call($methodName, array $params = null)
    {
        $result = array();
        try {
            $this->vkCore
                ->request($methodName, $params)
                ->each(function($index, $element) use (&$result) {
                        $result[] = $element;
                    })
            ;
        } catch (\Exception $e) {
            $this->registerError('Error while calling \''.$methodName.'\' method: ', $e);

            return null;
        }

        return $result;
    }

    /**
     * @param string $title
     * @param \Exception $exception
     */
    public function registerError($title, \Exception $exception = null)
    {
        $message = $exception
            ? sprintf('%s: (%s) %s', $title, $exception->getCode(), $exception->getMessage())
            : $title
        ;

        $this->errors[] = $message;
        $this->logger->addError($message);
    }

    /**
     * @return string
     */
    public function getLastError()
    {
        return end($this->errors);
    }
}