define([
    'Utils/CheckType',
    'Utils/Debug',
    'Pool/ArtistPoolService',
    'Pool/AlbumPoolService',
    'Pool/TrackPoolService',
    'Pool/TagPoolService',
    'Domain/Artist',
    'Domain/Track',
    'Domain/Tag'
], function (
    CheckType,
    Debug,
    ArtistPoolService,
    AlbumPoolService,
    TrackPoolService,
    TagPoolService,
    Artist,
    Track,
    Tag
) {
    Artist.prototype.getSimilar = function() {
        if (!this._promise_getSimilar) {
            this._promise_getSimilar = ArtistPoolService.artistGetSimilar(this);
        }

        return this._promise_getSimilar
    };
    Artist.prototype.getTopTracks = function() {
        if (!this._promise_getTopTracks) {
            this._promise_getTopTracks = TrackPoolService.artistGetTopTracks(this);
        }

        return this._promise_getTopTracks;
    };

    Track.prototype.getSimilar = function() {
        if (!this._promise_getSimilar) {
            this._promise_getSimilar = TrackPoolService.trackGetSimilar(this);
        }

        return this._promise_getSimilar
    };

    //Track.prototype.similar = function() {
    //    return TrackPoolService.getSimilar(this);
    //}
    //Tag.prototype.similar = function() {
    //    return TagPoolService.getSimilar(this);
    //}
});
