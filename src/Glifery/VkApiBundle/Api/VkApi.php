<?php

namespace Glifery\VkApiBundle\Api;

use Glifery\VkApiBundle\Exception\VkExceptionInterface;
use Glifery\VkApiBundle\Exception\VkRequestException;
use Glifery\VkApiBundle\Factory\ApiRequestFactory;
use Glifery\VkApiBundle\Factory\ApiResponseFactory;
use Glifery\VkApiBundle\Logger\VkExceptionLogger;
use Glifery\VkApiBundle\Model\ApiRequest;
use Glifery\VkApiBundle\Model\ApiResponse;

class VkApi
{
    /** @var ApiRequestFactory */
    private $apiRequestFactory;

    /** @var ApiResponseFactory */
    private $apiResponseFactory;

    /** @var VkConnection */
    private $vkConnection;

    /** @var VkExceptionLogger */
    private $vkExceptionLogger;

    /**
     * @param ApiRequestFactory $apiRequestFactory
     * @param ApiResponseFactory $apiResponseFactory
     * @param VkConnection $vkConnection
     * @param VkExceptionLogger $vkExceptionLogger
     */
    public function __construct(ApiRequestFactory $apiRequestFactory, ApiResponseFactory $apiResponseFactory, VkConnection $vkConnection, VkExceptionLogger $vkExceptionLogger)
    {
        $this->apiRequestFactory = $apiRequestFactory;
        $this->apiResponseFactory = $apiResponseFactory;
        $this->vkConnection = $vkConnection;
        $this->vkExceptionLogger = $vkExceptionLogger;
    }

    /**
     * @param string $token
     * @return $this
     */
    public function setToken($token)
    {
        $this->vkConnection->setToken($token);

        return $this;
    }

    /**
     * @param string $method
     * @param array $params
     * @return ApiRequest
     */
    public function createApiRequest($method, array $params = [])
    {
        return $this->apiRequestFactory->create($method, $params);
    }

    /**
     * @param ApiRequest $apiRequest
     * @return ApiResponse
     * @throws VkExceptionInterface
     */
    public function makeRequest(ApiRequest $apiRequest)
    {
        $apiResponse = $this->apiResponseFactory->createFromApiRequest($apiRequest);

        try {
            $this->validateApiRequest($apiRequest);

            $method = $apiRequest->getMethod();
            $params = $apiRequest->getParams();

            $response = $this->vkConnection->call($method, $params);

            $apiResponse->setResponse($response);
        } catch (VkExceptionInterface $e) {
            $apiResponse->setException($e);

            $this->vkExceptionLogger->logApiResponse($apiResponse);
        }

        return $apiResponse;
    }

    /**
     * @param ApiRequest $apiRequest
     * @throws VkRequestException
     */
    private function validateApiRequest(ApiRequest $apiRequest)
    {
        if (!strlen($apiRequest->getMethod())) {
            throw new VkRequestException('Invalid VK request method.');
        }
    }
}