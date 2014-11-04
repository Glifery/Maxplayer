<?php

namespace Maxplayer\VkRequestBundle\Transformer;

use Maxplayer\VkRequestBundle\Exception\TransformException;
use \Maxplayer\VkRequestBundle\Model\ResponceData\Audio;

class AudioTransformer implements TransformerInterface
{
    public function transform(\stdClass $item)
    {
        $audio = new Audio();
        $audio->setId($item->id);
        $audio->setArtist($item->artist);
        $audio->setTrack($item->title);
        $audio->setDuration($item->duration);
        $audio->setUrl($item->url);
        $audio->setLyrics($item->lyrics_id);

        return $audio;
    }
}