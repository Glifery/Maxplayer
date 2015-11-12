<?php

namespace Glifery\VkOAuthTokenBundle\Service;

use getjump\Vk\Auth;
use Glifery\VkOAuthTokenBundle\Exception\OAuthException;

class OAuthProvider
{
    /** @var integer */
    private $appKey;
    /** @var string */
    private $appSecret;
    /** @var array */
    private $scope;

    /** @var Auth */
    private $vkAuth;

    /**
     * @param integer $appKey
     * @param string $appSecret
     * @param array $scope
     */
    public function __construct($appKey, $appSecret, array $scope)
    {
        $this->appKey = $appKey;
        $this->appSecret = $appSecret;
        $this->scope = $scope;

        $this->init();
    }

    public function init()
    {
        $scope = implode(',', $this->scope);

        $this->vkAuth = Auth::getInstance();
        $this->vkAuth
            ->setAppId($this->appKey)
            ->setScope($scope)
            ->setSecret($this->appSecret)
        ;
    }

    /**
     * @param string $redirectUrl
     * @return string
     */
    public function getOAuthUrl($redirectUrl)
    {
        $oAuthUrl = $this->vkAuth
            ->setRedirectUri($redirectUrl)
            ->getUrl()
        ;

        return $oAuthUrl;
    }

    /**
     * @param string $code
     * @param string $redirectUrl
     * @return array|null
     */
    public function getToken($code, $redirectUrl)
    {
        $token = $this->vkAuth
            ->setRedirectUri($redirectUrl)
            ->getToken($code)
        ;

        if (!$token) return null;

        return [
            'user_id' => $token->userId,
            'token' => $token->token,
            'expired' => $token->expiresIn
        ];
    }
}