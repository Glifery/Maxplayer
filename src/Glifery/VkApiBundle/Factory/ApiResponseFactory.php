<?php

namespace Glifery\VkApiBundle\Factory;

use Glifery\VkApiBundle\Model\ApiRequest;
use Glifery\VkApiBundle\Model\ApiResponse;

class ApiResponseFactory
{
    /**
     * @param ApiRequest $apiRequest
     * @return ApiResponse
     */
    public function createFromApiRequest(ApiRequest $apiRequest)
    {
        $apiResponse = new ApiResponse();
        $apiResponse->setApiRequest($apiRequest);

        return $apiResponse;
    }
}