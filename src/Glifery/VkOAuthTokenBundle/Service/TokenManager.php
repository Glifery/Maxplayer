<?php

namespace Glifery\VkOAuthTokenBundle\Service;

use Doctrine\Common\Persistence\ObjectManager;
use Glifery\VkOAuthTokenBundle\Entity\Repository\TokenRepository;
use Glifery\VkOAuthTokenBundle\Entity\Token;

class TokenManager
{
    /** @var integer */
    private $appKey;

    /** @var TokenOwnerProvider */
    private $tokenOwnerProvider;

    /** @var ObjectManager */
    private $em;

    /** @var TokenRepository */
    private $tokenRepo;

    /**
     * @param integer $appKey
     * @param TokenOwnerProvider $tokenOwnerProvider
     * @param ObjectManager $em
     */
    public function __construct($appKey, TokenOwnerProvider $tokenOwnerProvider, ObjectManager $em)
    {
        $this->appKey = $appKey;
        $this->tokenOwnerProvider = $tokenOwnerProvider;
        $this->em = $em;
        $this->tokenRepo = $em->getRepository('GliferyVkOAuthTokenBundle:Token');
    }

    /**
     * @return Token|null
     */
    public function getGlobalToken()
    {
        $token = $this->tokenRepo->getLastToken($this->appKey);

        return $token;
    }

    /**
     * @param array $tokenInfo
     * @return Token
     */
    public function registerNewToken(array $tokenInfo)
    {
        $token = new Token();
        $token
            ->setAppKey($this->appKey)
            ->setVkUserId($tokenInfo['user_id'])
//            ->setOwner($this->tokenOwnerProvider->getOwner())//TODO: enable Owner token
            ->setToken($tokenInfo['token'])
            ->setExpired($tokenInfo['expired'])
            ->setCreatedAt(new \DateTime())
        ;

        $this->em->persist($token);
        $this->em->flush($token);

        return $token;
    }
}