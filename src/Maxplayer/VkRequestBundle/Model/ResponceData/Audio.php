<?php

namespace Maxplayer\VkRequestBundle\Model\ResponceData;

class Audio
{
    /** @var integer */
    private $id;

    /** @var string */
    private $artist;

    /** @var string */
    private $track;

    /** @var integer */
    private $duration;

    /** @var string */
    private $url;

    /** @var integer */
    private $lyrics;

    /** @var integer */
    private $genre;

    /**
     * @param string $artist
     */
    public function setArtist($artist)
    {
        $this->artist = $artist;
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
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $lyrics
     */
    public function setLyrics($lyrics)
    {
        $this->lyrics = $lyrics;
    }

    /**
     * @return int
     */
    public function getLyrics()
    {
        return $this->lyrics;
    }

    /**
     * @param string $title
     */
    public function setTrack($title)
    {
        $this->track = $title;
    }

    /**
     * @return string
     */
    public function getTrack()
    {
        return $this->track;
    }

    /**
     * @param string $url
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }

    /**
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * @param int $genre
     */
    public function setGenre($genre)
    {
        $this->genre = $genre;
    }

    /**
     * @return int
     */
    public function getGenre()
    {
        return $this->genre;
    }
}