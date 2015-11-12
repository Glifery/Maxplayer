<?php

namespace Glifery\VkOAuthTokenBundle\Service;

use Glifery\VkOAuthTokenBundle\Exception\OAuthException;
use Symfony\Bridge\Monolog\Logger;
use Symfony\Bundle\FrameworkBundle\Routing\Router;

class VkOAuth
{
    /** @var OAuthProvider */
    private $oAuthProvider;

    /** @var TokenManager */
    private $tokenManager;

    /** @var Router */
    private $router;

    /** @var Logger */
    private $logger;

    /**
     * @param OAuthProvider $OAuthProvider
     * @param TokenManager $tokenManager
     * @param Router $router
     */
    public function __construct(OAuthProvider $OAuthProvider, TokenManager $tokenManager, Router $router, Logger $logger)
    {
        $this->oAuthProvider = $OAuthProvider;
        $this->tokenManager = $tokenManager;
        $this->router = $router;
        $this->logger = $logger;
    }

    /**
     * @return string
     * @throws OAuthException
     */
    public function generateOAuthUrl()
    {
        try {
            $redirectUrl = $this->generateRedirectUrl();
            $oAuthUrl = $this->oAuthProvider->getOAuthUrl($redirectUrl);
        } catch (\Exception $e) {
            $this->generateException('Generate OAuth url error', $e);
        }

        return $oAuthUrl;
    }

    /**
     * @param $code
     * @return \Maxplayer\VkApiBundle\Entity\Token
     * @throws OAuthException
     */
    public function requestTokenByCode($code)
    {
        try {
            $redirectUrl = $this->generateRedirectUrl();
            $tokenInfo = $this->oAuthProvider->getToken($code, $redirectUrl);
        } catch (\Exception $e) {
            $this->generateException('register OAuth token error', $e);
        }

        if (!$tokenInfo) {
            $this->generateException('Unable to request token by code ' . $code);
        }

        $token = $this->tokenManager->registerNewToken($tokenInfo);

        return $token;
    }

    /**
     * @return string
     */
    private function generateRedirectUrl()
    {
        $callbackUrl = $this->router->getContext()->getScheme()
            . '://'
            . $this->router->getContext()->getHost()
            . $this->router->generate('glifery_vk_oauth_token.oauth_callback')
        ;

        return $callbackUrl;
    }

    /**
     * @param string $title
     * @param \Exception|null $exception
     * @throws OAuthException
     */
    private function generateException($title, \Exception $exception = null)
    {
        $message = $exception
            ? sprintf('%s: (%s) %s', $title, $exception->getCode(), $exception->getMessage())
            : $title
        ;

        $this->logger->addError($message);

        throw new OAuthException($message);
    }
}