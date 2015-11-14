<?php

namespace Glifery\VkApiBundle\Factory;

use Glifery\VkApiBundle\Model\ApiRequest;

class ApiRequestFactory
{
    /**
     * @param string $method
     * @param array $params
     * @return ApiRequest
     */
    public function create($method, array $params = [])
    {
        $apiRequest = new ApiRequest();
        $apiRequest->setMethod($method)->setParams($params);

        return $apiRequest;
    }
}