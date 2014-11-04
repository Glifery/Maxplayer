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

    /** @var string */
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
     * @param string $sound
     * @return $this
     */
    public function setSound($sound)
    {
        $this->sound = $sound;

        return $this;
    }

    /**
     * @return string
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
}