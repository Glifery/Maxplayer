<?php

namespace Maxplayer\RestBundle\Service;

use Glifery\VkApiBundle\Api\VkApi;
use Glifery\VkOAuthTokenBundle\Service\TokenManager;
use Maxplayer\RestBundle\Model\Track;

class VkOperationHandler
{
    /** @var TokenManager */
    private $tokenManager;

    /** @var VkApi */
    private $vkApi;

    /**
     * @param VkApi $vkApi
     * @param TokenManager $tokenManager
     */
    public function __construct(VkApi $vkApi, TokenManager $tokenManager)
    {
        $this->vkApi = $vkApi;
        $this->tokenManager = $tokenManager;

        $this->init();
    }

    private function init()
    {
        $this->vkApi->setToken($this->tokenManager->getGlobalToken()->getToken());
    }

    /**
     * @param Track $track
     * @return Track
     */
    public function fillTrackSound(Track $track)
    {
        $query = $track->getArtist().' - '.$track->getTrack();

        $apiRequest = $this->vkApi->createApiRequest('audio.search');
        $apiRequest
            ->addParam('q', $query)
            ->addParam('auto_complete', 0)
            ->addParam('lyrics', 0)
            ->addParam('performer_only', 0)
            ->addParam('sort', 2)
            ->addParam('search_own', 0)
            ->addParam('offset', 0)
            ->addParam('count', 20)
        ;

        $apiResponse = $this->vkApi->makeRequest($apiRequest);
        if ($apiResponse->isError()) {
            //TODO: handle error

            return $track;
        }

        $url = $apiResponse->getResponse()[0]->url;
        $track->setSound($url);

        return $track;
    }
}