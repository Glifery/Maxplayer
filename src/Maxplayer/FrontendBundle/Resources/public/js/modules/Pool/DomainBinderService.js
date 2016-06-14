define([
    'Utils/CheckType',
    'Utils/Debug',
    'Pool/ArtistPoolService',
    'Pool/AlbumPoolService',
    'Pool/TrackPoolService',
    'Pool/TagPoolService',
    'Pool/SoundPoolService',
    'Domain/Artist',
    'Domain/Album',
    'Domain/Track'
], function (
    CheckType,
    Debug,
    ArtistPoolService,
    AlbumPoolService,
    TrackPoolService,
    TagPoolService,
    SoundPoolService,
    Artist,
    Album,
    Track
) {
    Artist.prototype.getSimilar = function() {
        if (!this._promise_getSimilar) {
            this._promise_getSimilar = ArtistPoolService.artistGetSimilar(this);
        }

        return this._promise_getSimilar
    };
    Artist.prototype.getAlbums = function() {
        if (!this._promise_getAlbums) {
            this._promise_getAlbums = AlbumPoolService.artistGetAlbums(this);
        }

        return this._promise_getAlbums;
    };
    Artist.prototype.getTopTracks = function() {
        if (!this._promise_getTopTracks) {
            this._promise_getTopTracks = TrackPoolService.artistGetTopTracks(this);
        }

        return this._promise_getTopTracks;
    };

    Album.prototype.getArtist = function() {
        if (!this._promise_getArtist) {
            if (this._relation_artist) {
                this._promise_getArtist = Promise.resolve(this._relation_artist);
            } else {
                this._promise_getArtist = AlbumPoolService.albumGetArtist(this);
            }
        }

        return this._promise_getArtist
    };
    Album.prototype.getTracks = function() {
        if (!this._promise_getTracks) {
            this._promise_getTracks = TrackPoolService.albumGetTracks(this);
        }

        return this._promise_getTracks;
    };

    Track.prototype.getSimilar = function() {
        if (!this._promise_getSimilar) {
            this._promise_getSimilar = TrackPoolService.trackGetSimilar(this);
        }

        return this._promise_getSimilar
    };
    Track.prototype.getArtist = function() {
        if (!this._promise_getArtist) {
            if (this._relation_artist) {
                this._promise_getArtist = Promise.resolve(this._relation_artist);
            } else {
                this._promise_getArtist = ArtistPoolService.trackGetArtist(this);
            }
        }

        return this._promise_getArtist
    };
    Track.prototype.getAlbum = function() {
        if (!this._promise_getAlbum) {
            if (this._relation_album) {
                this._promise_getAlbum = Promise.resolve(this._relation_album);
            } else {
                this._promise_getArtist = AlbumPoolService.trackGetAlbum(this);
            }
        }

        return this._promise_getAlbum
    };
    Track.prototype.getSound = function() {
        if (!this._promise_getSound) {
            this._promise_getSound = SoundPoolService.getSound(this);
        }

        return this._promise_getSound
    };
});
