<?php

namespace Maxplayer\VkRequestBundle\Service;

use Doctrine\Common\Collections\ArrayCollection;
use Maxplayer\VkApiBundle\Service\VkTransport;
use Maxplayer\VkRequestBundle\Model\ApiRequest;
use Maxplayer\VkRequestBundle\Model\ApiResponce;

class VkGate
{
    /** @var VkTransport */
    private $vkTransport;

    /**
     * @param VkTransport $vkTransport
     */
    public function __construct(VkTransport $vkTransport)
    {
        $this->vkTransport = $vkTransport;
    }

    /**
     * @param ApiRequest $apiRequest
     * @return ApiResponce
     */
    public function call(ApiRequest $apiRequest)
    {
        $apiResponce = $this->createApiResponce($apiRequest);
        $this->validateApiRequest($apiRequest, $apiResponce);

        if (!$apiResponce->isSuccess()) {
            return $apiResponce;
        }

        $method = $apiRequest->getMethod();
        $params = $apiRequest->getParams();

        if ($result = $this->vkTransport->call($method, $params)) {
            $this->setResultToResponce($result, $apiResponce);
        } else {
            $error = $this->vkTransport->getLastError();
            $this->registerError($error, $apiResponce);
        }

        return $apiResponce;
    }

    /**
     * @param ApiRequest $apiRequest
     * @return ApiResponce
     */
    private function createApiResponce(ApiRequest $apiRequest)
    {
        $data = new ArrayCollection();
        $apiResponce = new ApiResponce($apiRequest, new \DateTime, $data);

        return $apiResponce;
    }

    /**
     * @param ApiRequest $apiRequest
     * @param ApiResponce $apiResponce
     */
    private function validateApiRequest(ApiRequest $apiRequest, ApiResponce $apiResponce)
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

        foreach ($result as $item) {
            $data->add($item);
        }
    }
}