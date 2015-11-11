<?php

namespace Maxplayer\RestBundle\Controller;

use Maxplayer\RestBundle\Model\Track;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class TrackController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     * @throws BadRequestHttpException
     * @throws \Maxplayer\RestBundle\Exception\InputOutputException
     */
    public function fillTrackSoundAction(Request $request)
    {
        $inputOutputGate = $this->get('maxplayer_rest.input_output_gate');
        $vkRepository = $this->get('maxplayer_vk_request.vk_repository');

        try {
            $track = $this->createTrackFromRequest();
        } catch (\Exception $e) {
            $inputOutputGate->addError($e->getMessage());

            return $inputOutputGate->getResponce();
        }

        if (!$vkRepository->fillTrackSound($track)) {
            $inputOutputGate->addError('Can\'t fill track sound');
        }
        $inputOutputGate->setResponceData($track->toArray());

        return $inputOutputGate->getResponce();
    }

    /**
     * @return Track
     * @throws BadRequestHttpException
     * @throws \Maxplayer\RestBundle\Exception\InputOutputException
     */
    private function createTrackFromRequest()
    {
        $request = $this->get('request');
        $inputOutputGate = $this->get('maxplayer_rest.input_output_gate');

        $inputOutputGate->setRequest($request);
        $trackRawData = $inputOutputGate->getRequestDate();

        if (!isset($trackRawData['track']['artist']) || !strlen($trackRawData['track']['artist'])) {
            throw new BadRequestHttpException('Invalid parameter track[artist]');
        }
        if (!isset($trackRawData['track']['track']) || !strlen($trackRawData['track']['track'])) {
            throw new BadRequestHttpException('Invalid parameter track[track]');
        }

        $track = new Track();
        $track
            ->setArtist($trackRawData['track']['artist'])
            ->setTrack($trackRawData['track']['track'])
        ;

        return $track;
    }
}
