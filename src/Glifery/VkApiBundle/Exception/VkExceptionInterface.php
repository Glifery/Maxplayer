<?php


namespace Glifery\VkApiBundle\Exception;

interface VkExceptionInterface
{
    /**
     * @return string
     */
    public function getMessage();
}