<?php

namespace Maxplayer\RestBundle\Service;

use Maxplayer\RestBundle\Exception\InputOutputException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class InputOutputGate
{
    /** @var Request */
    private $request;

    /** @var mixed */
    private $responseData;

    /** @var array */
    private $errors;

    public function __construct()
    {
        $this->errors = array();
    }

    /**
     * @param Request $request
     * @return $this
     */
    public function setRequest(Request $request)
    {
        $this->request = $request;

        return $this;
    }

    /**
     * @return mixed
     * @throws InputOutputException
     */
    public function getRequestDate()
    {
        if (!$this->request) {
            throw new InputOutputException('You must inject Request object first');
        }

        $requestData = $this->request->get('data');

        return $requestData;
    }

    /**
     * @param mixed $data
     * @return InputOutputGate $this
     * @throws InputOutputException
     */
    public function setResponseData($data)
    {
        if ($this->responseData) {
            throw new InputOutputException('Trying to set Response data in second time');
        }

        $this->responseData = $data;

        return $this;
    }

    /**
     * @param string $error
     * @return InputOutputGate $this
     */
    public function addError($error)
    {
        $this->errors[] = $error;

        return $this;
    }

    public function getResponse()
    {
        if (!$this->responseData && !count($this->errors)) {
            throw new InputOutputException('Trying to create Responce with neither data or errors');
        }

        $responseArray = array(
            'status' => count($this->errors) ? 'error' : 'success',
            'data'   => $this->responseData,
            'errors' => $this->errors
        );
        $response = new JsonResponse($responseArray);

        return $response;
    }
}