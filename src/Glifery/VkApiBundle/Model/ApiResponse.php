<?php

namespace Glifery\VkApiBundle\Model;

use Glifery\VkApiBundle\Exception\VkExceptionInterface;

class ApiResponse
{
    /** @var ApiRequest */
    private $apiRequest;

    /** @var mixed|null */
    private $response;

    /** @var boolean */
    private $error;

    /** @var string */
    private $errorMessage;

    /** @var VkExceptionInterface|null */
    private $exception;

    /**
     * @return ApiRequest
     */
    public function getApiRequest()
    {
        return $this->apiRequest;
    }

    /**
     * @param ApiRequest $apiRequest
     * @return $this
     */
    public function setApiRequest($apiRequest)
    {
        $this->apiRequest = $apiRequest;

        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * @param mixed $response
     * @return $this
     */
    public function setResponse($response)
    {
        $this->response = $response;

        return $this;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function setError($message)
    {
        $this->error = true;
        $this->errorMessage = $message;

        return $this;
    }

    public function setException(VkExceptionInterface $e)
    {
        $this->exception = $e;
        $this->setError($e->getMessage());

        return $this;
    }

    /**
     * @return boolean
     */
    public function isError()
    {
        return $this->error;
    }

    /**
     * @return string
     */
    public function getErrorMessage()
    {
        return $this->errorMessage;
    }

    /**
     * @return VkExceptionInterface|null
     */
    public function getException()
    {
        return $this->exception;
    }
}