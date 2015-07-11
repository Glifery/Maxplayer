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
    Artist.prototype.similar = function() {
        return ArtistPoolService.getSimilar(this);
    }
    Track.prototype.similar = function() {
        return TrackPoolService.getSimilar(this);
    }
    Tag.prototype.similar = function() {
        return TagPoolService.getSimilar(this);
    }
});
