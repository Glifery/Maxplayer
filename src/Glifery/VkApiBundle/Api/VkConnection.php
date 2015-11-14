<?php

namespace Glifery\VkApiBundle\Api;

use getjump\Vk\Core;
use Glifery\VkApiBundle\Exception\VkConnectionException;
use Glifery\VkApiBundle\Exception\VkResponseException;

class VkConnection
{
    /** @var string */
    private $token;

    /** @var Core */
    private $vkCore;

    /**
     * @param string $apiVersion
     */
    public function __construct($apiVersion)
    {
        $this->vkCore = Core::getInstance()->apiVersion($apiVersion);
    }

    /**
     * @param string $token
     * @return $this
     */
    public function setToken($token)
    {
        $this->token = $token;
        $this->vkCore->setToken($this->token);

        return $this;
    }

    /**
     * @param string $methodName
     * @param array $params
     * @return array|bool
     * @throws VkConnectionException
     * @throws VkResponseException
     */
    public function call($methodName, array $params = null)
    {
        if (!$this->token) {
            throw new VkConnectionException(sprintf('Attempt to call VK method \'%s\' without a token.', $methodName));
        }

        $transaction = $this->vkCore->request($methodName, $params)->fetchData();
        if ($transaction->error) {
            throw new VkResponseException($transaction->error->getMessage(), $transaction->error->getCode());

            $e = new VkResponseException(sprintf('Vk %s request error (%s): %s.', $methodName, $transaction->error->getCode(), $transaction->error->getMessage()), $transaction->error->getCode());
            $e->setErrorCode($transaction->error->getCode());
            $e->setErrorMessage($transaction->error->getMessage());
            $e->setResponse($transaction->getResponse());

            throw $e;
        }

        if (!$response = $transaction->response->items) {
            throw new VkResponseException(sprintf('Vk %s request error: request doesn\'t contain neither error nor response.', $methodName));
        }

        return $response;
    }

    private function fillResponseData($items)
    {
        $items = $items;
    }
} 