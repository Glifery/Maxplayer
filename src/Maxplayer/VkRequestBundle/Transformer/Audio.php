<?php

namespace Maxplayer\VkRequestBundle\Transformer;

use Maxplayer\VkRequestBundle\Exception\TransformException;

class Audio implements TransformerInterface
{
    public function transform(\stdClass $item)
    {
        return $item;
    }
}