<?php

namespace Maxplayer\VkRequestBundle\Transformer;

interface TransformerInterface
{
    public function transform(\stdClass $item);
}