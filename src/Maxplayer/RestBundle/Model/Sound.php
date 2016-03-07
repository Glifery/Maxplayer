<?php

namespace Maxplayer\RestBundle\Model;

class Sound
{
    /** @var Track */
    private $track;

    /** @var string */
    private $artist;

    /** @var string */
    private $title;

    /** @var integer */
    private $duration;

    /** @var string */
    private $url;

    /**
     * @return string
     */
    public function getArtist()
    {
        return $this->artist;
    }

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
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
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
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Track
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     * @param Track $track
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
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param string $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array(
            'artist'   => $this->getArtist(),
            'title'    => $this->getTitle(),
            'duration' => $this->getDuration(),
            'url'      => $this->getUrl()
        );
    }
}