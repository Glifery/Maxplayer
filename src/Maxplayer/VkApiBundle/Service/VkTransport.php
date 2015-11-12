<?php

namespace Maxplayer\VkApiBundle\Service;

use Doctrine\ORM\EntityManager;
use getjump\Vk\Auth;
use getjump\Vk\Core;
use GuzzleHttp\Exception\RequestException;
use Maxplayer\VkApiBundle\Entity\Token;
use Symfony\Bridge\Monolog\Logger;

class VkTransport
{
    const API_VERSION = '5.26';

    /** @var integer */
    private $apiKey;
    /** @var string */
    private $apiSecret;
    /** @var array */
    private $scope;

    /** @var  EntityManager */
    private $em;
    /** @var Logger */
    private $logger;

    /** @var Token */
    private $token;

    /** @var Auth */
    private $vkAuth;
    /** @var Core */
    private $vkCore;

    /** @var array */
    private $errors;

    public function __construct($apiKey, $apiSecret, $scope, EntityManager $em, Logger $logger)
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        $this->scope = $scope;
        $this->em = $em;
        $this->logger = $logger;
        $this->errors = array();

        $this->loadToken();
        $this->constructVkAuthObject();
        $this->constructVkCoreObject();
    }

    private function constructVkAuthObject()
    {
        $scope = implode(',', $this->scope);
        $this->vkAuth = Auth::getInstance();
        $this->vkAuth
            ->setAppId($this->apiKey)
            ->setScope($scope)
            ->setSecret($this->apiSecret)
        ;
    }

    private function constructVkCoreObject()
    {
        $this->vkCore = Core::getInstance()->apiVersion(self::API_VERSION);
        if ($this->token) {
            $this->vkCore->setToken($this->token->getToken());
        }
    }

    /**
     * @return bool
     */
    private function loadToken()
    {
        if ($token = $this->em->getRepository('MaxplayerVkApiBundle:Token')->getToken($this->apiKey)) {
            $this->token = $token;

            return true;
        }

        return false;
    }

    /**
     * @param int $apiKey
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    /**
     * @return int
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * @param \Maxplayer\VkApiBundle\Entity\Token $token
     */
    public function setToken($token)
    {
        $this->token = $token;
    }

    /**
     * @return \Maxplayer\VkApiBundle\Entity\Token
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * @param $redirectUrl
     * @return string
     */
    public function generateOAuthUrl($redirectUrl)
    {
        $this->vkAuth
            ->setRedirectUri($redirectUrl)
        ;

        return $this->vkAuth->getUrl();
    }

    /**
     * @param string $code
     * @param string $redirectUri
     * @return bool
     */
    public function requestTokenByCode($code, $redirectUri)
    {
        $this->vkAuth->setRedirectUri($redirectUri);

        $vkToken = null;
        try {
            /** @var \getjump\Vk\Response\Auth $vkToken */
            $vkToken = $this->vkAuth->getToken($code);
        } catch (RequestException $e) {
            $this->registerError('Getting new VK token error: '.$e->getMessage());

            return false;
        }
        if (!$vkToken) {
            $this->registerError('New VK token is incorrect: \''.$vkToken.'\'');

            return false;
        }

        $this->vkCore->setToken($vkToken);

        $token = new Token();
        $token->setAppKey($this->apiKey);
        $token->setToken($vkToken->token);
        $token->setExpired($vkToken->expiresIn);
        $token->setVkUserId($vkToken->userId);
        $token->setCreatedAt(new \DateTime());

        $this->token = $token;
        $this->em->persist($token);
        $this->em->flush($token);
        $this->em->clear('Maxplayer\VkApiBundle\Entity\Token');

        return true;
    }

    /**
     * @param string $methodName
     * @param array $params
     * @return array|null
     */
    public function call($methodName, array $params = null)
    {
        if (!$this->token) {
            $this->registerError('Trying to use api for ID \''.$this->apiKey.'\' without token. To get token visit %vk_api.auth_path%');

            return null;
        }

        $result = array();
        try {
            $this->vkCore
                ->request($methodName, $params)
                ->each(function($index, $element) use (&$result) {
                        $result[] = $element;
                    })
            ;
        } catch (\Exception $e) {
            $this->registerError('Error while calling \''.$methodName.'\' method: '.$e->getMessage());

            return null;
        }

        return $result;
    }

    public function registerError($message)
    {
        $this->errors[] = $message;
        $this->logger->addError($message);
    }

    public function getLastError()
    {
        return end($this->errors);
    }
}