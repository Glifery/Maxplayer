<?php

namespace Glifery\VkOAuthTokenBundle\Service;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class TokenOwnerProvider
{
    /** @var TokenStorage */
    private $tokenStorage;

    /**
     * @param TokenStorage $tokenStorage
     */
    public function __construct(TokenStorage $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return string
     */
    public function getOwner()
    {
        if (!$token = $this->tokenStorage->getToken()) {
            return null;
        }

        $owner = $this->encodeToken($token);

        return $owner;
    }

    /**
     * @param TokenInterface $token
     * @return string
     */
    private function encodeToken(TokenInterface $token)
    {
        $encode = md5($token);

        return $encode;
    }
}