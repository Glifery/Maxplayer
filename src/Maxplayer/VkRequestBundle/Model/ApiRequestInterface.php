<?php

namespace Maxplayer\VkRequestBundle\Model;

interface ApiRequestInterface
{
    public function getMethod();
    public function getParams();
}