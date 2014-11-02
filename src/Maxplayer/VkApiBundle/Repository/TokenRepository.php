<?php

namespace Maxplayer\VkApiBundle\Repository;

use Doctrine\ORM\EntityRepository;

class TokenRepository extends EntityRepository
{
    public function getToken($appKey)
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