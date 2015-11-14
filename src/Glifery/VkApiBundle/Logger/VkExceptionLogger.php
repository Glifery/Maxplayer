<?php

namespace Glifery\VkApiBundle\Logger;

use Glifery\VkApiBundle\Model\ApiResponse;
use Symfony\Bridge\Monolog\Logger;

class VkExceptionLogger
{
    /** @var Logger */
    private $logger;

    /**
     * @param Logger $logger
     */
    public function __construct(Logger $logger)
    {
        $this->logger = $logger;
    }

    /**
     * @param ApiResponse $apiResponse
     */
    public function logApiResponse(ApiResponse $apiResponse)
    {
        $this->logger->addError(
            $apiResponse->getException() ? $apiResponse->getException()->getMessage() : 'Unknown VK api error.',
            [
                $apiResponse->getApiRequest()->getMethod(),
                json_encode($apiResponse->getApiRequest()->getParams())
            ]
        );
    }
}