<?php

namespace Maxplayer\VkRequestBundle\Service;

use Maxplayer\VkRequestBundle\Exception\ConfigureException;
use Maxplayer\VkRequestBundle\Exception\TransformException;
use Maxplayer\VkRequestBundle\Model\ApiResponce;
use Maxplayer\VkRequestBundle\Transformer\TransformerInterface;

class TransformManager
{
    private $transformers;

    public function __construct()
    {
        $this->transformers = array();
    }

    public function transformResponceData(ApiResponce $apiResponce, \stdClass $originalItem)
    {
        $methodName = $apiResponce->getApiRequest()->getMethod();

        if (!array_key_exists($methodName, $this->transformers)) {
            return $originalItem;
        }

        /** @var TransformerInterface $transformer */
        $transformer = $this->transformers[$methodName];

        if (!$transformedItem = $transformer->transform($originalItem)) {
            throw new TransformException('transformer returns empty data');
        }

        return $transformedItem;
    }

    public function registerTransformer($methodName, $className)
    {
        if (!strlen($methodName)) {
            throw new ConfigureException('Trying to register transformer for empty method. Check your TransformerManager configuration');
        }
        if (!strlen($className) || !class_exists($className)) {
            throw new ConfigureException('Transformer with class name \''.$className.'\' not found. Check your TransformerManager configuration');
        }

        if (!in_array('Maxplayer\VkRequestBundle\Transformer\TransformerInterface', class_implements($className))) {
            throw new ConfigureException('Class \''.$className.'\' is not transformer. Check your TransformerManager configuration');
        }

        if (isset($this->transformers[$methodName])) {
            throw new ConfigureException('Transformer for method \''.$methodName.'\' already registered. Check your TransformerManager configuration');
        }

        $this->transformers[$methodName] = new $className;
    }
}