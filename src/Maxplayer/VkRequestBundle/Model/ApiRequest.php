<?php

namespace Maxplayer\VkRequestBundle\Model;

class ApiRequest
{
    /** @var string */
    private $method;

    /** @var array */
    private $params;

    public function __construct()
    {
        $this->params = array();
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
        $this->params = $params;

        return $this;
    }

    /**
     * @return array
     */
    public function getParams()
    {
        return $this->params;
    }

    /**
     * @param string $name
     * @param mix $value
     * @return $this
     */
    public function addParam($name, $value)
    {
        $this->params[$name] = $value;

        return $this;
    }

    /**
     * @param $name
     * @return mix|null
     */
    public function getParam($name)
    {
        if (isset($this->params[$name])) {
            return $this->params[$name];
        }

        return null;
    }
}