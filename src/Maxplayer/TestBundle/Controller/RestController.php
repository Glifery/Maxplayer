<?php

namespace Maxplayer\TestBundle\Controller;

use Maxplayer\RestBundle\Model\Track;
use Maxplayer\VkRequestBundle\Service\VkRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class RestController extends Controller
{
    public function trackAction()
    {
        /** @var VkRepository $vk */
        $vk = $this->get('maxplayer_vk_request.vk_repository');

        $track = new Track();
        $track
            ->setArtist('Nickelback')
            ->setTrack('Animals')
            ->setDuration(3*60+6)
        ;
        $vk->fillTrackSound($track);

        return new Response('sound of '.$track->getArtist().' - '.$track->getTrack().': <a target="_blank" href="'.$track->getSound().'">play</a>');
    }
}