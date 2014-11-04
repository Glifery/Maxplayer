<?php

namespace Maxplayer\VkRequestBundle\Transformer;

use \Maxplayer\VkRequestBundle\Model\ResponceData\Audio;

class AudioTransformer extends AutomaticTransformer implements TransformerInterface
{
    public function transform(\stdClass $item)
    {
        $audio = new Audio();
        $this->transformWithMap($audio, array(
                'id' => 'id',
                'artist' => 'artist',
                'track' => 'title',
                'duration' => 'duration',
                'url' => 'url',
                'lyrics' => 'lyrics_id',
                'genre' => 'genre_id'
            ), $item);

        return $audio;
    }
}