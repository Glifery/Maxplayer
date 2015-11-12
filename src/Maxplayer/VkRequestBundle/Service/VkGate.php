<?php

namespace Maxplayer\VkRequestBundle\Service;

use Doctrine\Common\Collections\ArrayCollection;
use Maxplayer\VkApiBundle\Service\VkTransport;
use Maxplayer\VkRequestBundle\Exception\TransformException;
use Maxplayer\VkRequestBundle\Model\ApiRequestInterface;
use Maxplayer\VkRequestBundle\Model\ApiResponce;

class VkGate
{
    /** @var VkConnection */
    private $vkConnection;

    /** @var TransformManager */
    private $transformManager;

    /**
     * @param VkConnection $vkConnection
     * @param TransformManager $transformManager
     */
    public function __construct(VkConnection $vkConnection, TransformManager $transformManager = null)
    {
        $this->vkConnection = $vkConnection;
        $this->transformManager = $transformManager;
    }

    /**
     * @param ApiRequestInterface $apiRequest
     * @return ApiResponce
     */
    public function call(ApiRequestInterface $apiRequest)
    {
        $apiResponce = $this->createApiResponce($apiRequest);
        $this->validateApiRequest($apiRequest, $apiResponce);

        if (!$apiResponce->isSuccess()) {
            return $apiResponce;
        }

        $method = $apiRequest->getMethod();
        $params = $apiRequest->getParams();

        if ($result = $this->vkConnection->call($method, $params)) {
            $this->setResultToResponce($result, $apiResponce);
        } else {
            $error = $this->vkConnection->getLastError();
            $this->registerError($error, $apiResponce);
        }

        return $apiResponce;
    }

    /**
     * @param ApiRequestInterface $apiRequest
     * @return ApiResponce
     */
    private function createApiResponce(ApiRequestInterface $apiRequest)
    {
        $data = new ArrayCollection();
        $apiResponce = new ApiResponce($apiRequest, new \DateTime, $data);

        return $apiResponce;
    }

    /**
     * @param ApiRequestInterface $apiRequest
     * @param ApiResponce $apiResponce
     */
    private function validateApiRequest(ApiRequestInterface $apiRequest, ApiResponce $apiResponce)
    {
        if (!$apiRequest->getMethod()) {
            $this->registerError('Empty VK api request method', $apiResponce);
        }
    }

    /**
     * @param $message
     * @param ApiResponce $apiResponce
     */
    private function registerError($message, ApiResponce $apiResponce)
    {
        $apiResponce->addError($message);
        // TODO: logger
    }

    /**
     * @param array $result
     * @param ApiResponce $apiResponce
     */
    private function setResultToResponce(array $result, ApiResponce $apiResponce)
    {
        /** @var ArrayCollection $data */
        $data = $apiResponce->getData();

        foreach ($result as $index => $item) {
            if ($this->transformManager) {
                try {
                    $item = $this->transformManager->transformResponceData($apiResponce, $item);
                } catch (TransformException $e) {
                    $apiResponce->addError('Transforming '.$index.' item error: '.$e->getMessage());

                    continue;
                }
            }

            $data->add($item);
        }
    }
}