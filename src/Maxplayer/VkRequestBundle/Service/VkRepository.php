<?php

namespace Maxplayer\VkRequestBundle\Service;

use Maxplayer\RestBundle\Model\Track;
use Maxplayer\VkRequestBundle\Model\ApiRequest;
use Maxplayer\VkRequestBundle\Model\ResponceData\Audio;

class VkRepository
{
    /** @var \Maxplayer\VkRequestBundle\Service\VkGate */
    private $vkGate;

    /**
     * @param VkGate $vkGate
     */
    public function __construct(VkGate $vkGate)
    {
        $this->vkGate = $vkGate;
    }

    /**
     * @param Track $track
     * @return bool
     */
    public function fillTrackSound(Track $track)
    {
        $query = $track->getArtist().' - '.$track->getTrack();

        $apiRequest = new ApiRequest();
        $apiRequest
            ->setMethod('audio.search')
            ->addParam('q', $query)
            ->addParam('auto_complete', 0)
            ->addParam('lyrics', 0)
            ->addParam('performer_only', 0)
            ->addParam('sort', 2)
            ->addParam('search_own', 0)
            ->addParam('offset', 0)
            ->addParam('count', 20)
        ;

        $apiResponce = $this->vkGate->call($apiRequest);
        if (!$apiResponce->isSuccess()) {
            return false;
        }

        foreach ($apiResponce->getData() as $audio) {
            /** @var Audio $audio */
            if ($audio->getDuration() == $track->getDuration()) {
                $track->setSound($audio->getUrl());

                return true;
            }
        }

        $track->setSound($apiResponce->getData()[0]->getUrl());

        return true;
    }
}