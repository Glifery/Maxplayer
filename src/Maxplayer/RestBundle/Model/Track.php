<?php

namespace Maxplayer\RestBundle\Model;

class Track
{
    /** @var string */
    private $artist;

    /** @var string */
    private $track;

    /** @var integer */
    private $duration;

    /** @var Sound */
    private $sound;

    /**
     * @param string $artist
     * @return $this
     */
    public function setArtist($artist)
    {
        $this->artist = $artist;

        return $this;
    }

    /**
     * @return string
     */
    public function getArtist()
    {
        return $this->artist;
    }

    /**
     * @param int $duration
     * @return $this
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;

        return $this;
    }

    /**
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * @param Sound $sound
     * @return $this
     */
    public function setSound(Sound $sound)
    {
        $this->sound = $sound;

        return $this;
    }

    /**
     * @return Sound
     */
    public function getSound()
    {
        return $this->sound;
    }

    /**
     * @param string $track
     * @return $this
     */
    public function setTrack($track)
    {
        $this->track = $track;

        return $this;
    }

    /**
     * @return string
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array(
          'artist'   => $this->getArtist(),
          'track'    => $this->getTrack(),
          'duration' => $this->getDuration(),
          'sound'    => $this->getSound()
        );
    }
}