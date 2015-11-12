<?php

namespace Glifery\VkOAuthTokenBundle\Entity;

class Token
{
    /** @var integer */
    private $id;

    /** @var integer */
    private $appKey;

    /** @var string */
    private $owner;

    /** @var integer */
    private $vkUserId;

    /** @var string */
    private $token;

    /** @var integer */
    private $expired;

    /** @var \DateTime */
    private $createdAt;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set appKey
     *
     * @param integer $appKey
     * @return Token
     */
    public function setAppKey($appKey)
    {
        $this->appKey = $appKey;

        return $this;
    }

    /**
     * Get appKey
     *
     * @return integer 
     */
    public function getAppKey()
    {
        return $this->appKey;
    }

    /**
     * Set vkUserId
     *
     * @param integer $vkUserId
     * @return Token
     */
    public function setVkUserId($vkUserId)
    {
        $this->vkUserId = $vkUserId;

        return $this;
    }

    /**
     * Get vkUserId
     *
     * @return integer 
     */
    public function getVkUserId()
    {
        return $this->vkUserId;
    }

    /**
     * @return mixed
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * @param mixed $owner
     * @return $this
     */
    public function setOwner($owner)
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * Set token
     *
     * @param string $token
     * @return Token
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string 
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * Set expired
     *
     * @param integer $expired
     * @return Token
     */
    public function setExpired($expired)
    {
        $this->expired = $expired;

        return $this;
    }

    /**
     * Get expired
     *
     * @return integer 
     */
    public function getExpired()
    {
        return $this->expired;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Token
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
}
