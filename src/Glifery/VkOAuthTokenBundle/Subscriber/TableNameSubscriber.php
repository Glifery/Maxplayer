<?php

namespace Glifery\VkOAuthTokenBundle\Subscriber;

use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;

class TableNameSubscriber implements EventSubscriber
{
    /** @var string */
    private $tokenTable;

    /**
     * @param $tokenTable
     */
    public function __construct($tokenTable)
    {
        $this->tokenTable = $tokenTable;
    }

    /**
     * Returns an array of events this subscriber wants to listen to.
     *
     * @return array
     */
    public function getSubscribedEvents()
    {
        return array('loadClassMetadata');
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $args)
    {
        $classMetadata = $args->getClassMetadata();
        if ($classMetadata->isInheritanceTypeSingleTable() && !$classMetadata->isRootEntity()) {
            return;
        }

        if ($classMetadata->getTableName() !== 'vk_oauth_token') {
            return;
        }

        $classMetadata->setTableName($this->tokenTable);

        foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
            if ($mapping['type'] == \Doctrine\ORM\Mapping\ClassMetadataInfo::MANY_TO_MANY) {
                $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->tokenTable;
            }
        }
    }
}