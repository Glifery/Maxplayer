<?php

namespace Glifery\VkOAuthTokenBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Maxplayer\VkApiBundle\Entity\Token;

class TokenRepository extends EntityRepository
{
    /**
     * @param string $appKey
     * @return Token|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getLastToken($appKey)
    {
        $qb = $this->createQueryBuilder('t');
        $result = $qb
            ->where($qb->expr()->eq('t.appKey', $appKey))
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->setMaxResults(1)
            ->getOneOrNullResult()
        ;

        return $result;
    }
}