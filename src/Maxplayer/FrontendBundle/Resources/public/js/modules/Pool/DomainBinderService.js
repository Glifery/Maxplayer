define([
    'Utils/CheckType',
    'Utils/Debug',
    'Pool/ArtistPoolService',
    'Domain/Artist'
], function (
    CheckType,
    Debug,
    ArtistPoolService,
    Artist
) {
    Artist.prototype.similar = function() {
        return ArtistPoolService.getSimilar(this);
    }
});
