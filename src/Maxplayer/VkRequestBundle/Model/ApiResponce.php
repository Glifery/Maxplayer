<?php

namespace Maxplayer\VkRequestBundle\Model;

use Doctrine\Common\Collections\ArrayCollection;

class ApiResponce
{
    /** @var ApiRequest */
    private $apiRequest;

    /** @var \DateTime */
    private $createdAt;

    /** @var boolean */
    private $success;

    /** @var array */
    private $errors;

    /** @var ArrayCollection */
    private $data;

    public function __construct(ApiRequest $apiRequest, \DateTime $createdAt, ArrayCollection $data)
    {
        $this->apiRequest = $apiRequest;
        $this->createdAt = $createdAt;
        $this->data = $data;

        $this->success = true;
        $this->errors = array();
    }

    public function isSuccess()
    {
        return $this->success;
    }

    public function addError($message)
    {
        $this->success = false;
        $this->errors[] = $message;

        return $this;
    }

    /**
     * @return \Maxplayer\VkRequestBundle\Model\ApiRequest
     */
    public function getApiRequest()
    {
        return $this->apiRequest;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @return \Doctrine\Common\Collections\ArrayCollection
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }
}