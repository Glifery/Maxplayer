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

        $inputOutputGate->setRequest($request);

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
        $trackRawData = $this->get('maxplayer_rest.input_output_gate')->getRequestDate();

        if (!isset($trackRawData['artist']) || !strlen($trackRawData['artist'])) {
            throw new BadRequestHttpException('Invalid parameter track[artist]');
        }
        if (!isset($trackRawData['track']) || !strlen($trackRawData['track'])) {
            throw new BadRequestHttpException('Invalid parameter track[track]');
        }
        if (!isset($trackRawData['duration']) || !strlen($trackRawData['duration'])) {
            throw new BadRequestHttpException('Invalid parameter track[duration]');
        }

        $track = new Track();
        $track
            ->setArtist($trackRawData['artist'])
            ->setTrack($trackRawData['track'])
            ->setDuration($trackRawData['duration'])
        ;

        return $track;
    }
}
