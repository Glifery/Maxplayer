<?php

namespace Maxplayer\VkApiBundle\Service;

use Doctrine\ORM\EntityManager;
use getjump\Vk\Auth;
use getjump\Vk\Core;
use Maxplayer\VkApiBundle\Entity\Token;

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

    /** @var Token */
    private $token;

    /** @var Auth */
    private $vkAuth;

    /** @var Core */
    private $vkCore;

    public function __construct($apiKey, $apiSecret, $scope, EntityManager $em)
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        $this->scope = $scope;
        $this->em = $em;

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
    public function getAuthUrl($redirectUrl)
    {
        $this->vkAuth
            ->setRedirectUri($redirectUrl)
        ;

        return $this->vkAuth->getUrl();
    }

    /**
     * @param string $code
     * @param string $redirectUri
     */
    public function getNewTokenByCode($code, $redirectUri)
    {
        $this->vkAuth->setRedirectUri($redirectUri);

        /** @var \getjump\Vk\Response\Auth $vkToken */
        if ($vkToken = $this->vkAuth->getToken($code)) {
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
        }
    }

    public function getInstance()
    {
        return $this->vkCore;
    }
}