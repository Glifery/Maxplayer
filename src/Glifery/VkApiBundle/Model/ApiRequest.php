<?php

namespace Glifery\VkApiBundle\Model;

use Doctrine\Common\Collections\ArrayCollection;

class ApiRequest
{
    /** @var string */
    private $method;

    /** @var ArrayCollection */
    private $params;

    public function __construct()
    {
        $this->params = new ArrayCollection();
    }

    /**
     * @param string $method
     * @return $this
     */
    public function setMethod($method)
    {
        $this->method = $method;

        return $this;
    }

    /**
     * @return string
     */
    public function getMethod()
    {
        return $this->method;
    }

    /**
     * @param array $params
     * @return $this
     */
    public function setParams($params)
    {
        $this->params->clear();

        foreach ($params as $name => $value) {
            $this->addParam($name, $value);
        }

        return $this;
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return $this->params->toArray();
    }

    /**
     * @param string $name
     * @param mixed $value
     * @return $this
     */
    public function addParam($name, $value)
    {
        $this->params->set($name, $value);

        return $this;
    }

    /**
     * @param $name
     * @return mixed|null
     */
    public function getParam($name)
    {
        return $this->params->get($name);
    }
}