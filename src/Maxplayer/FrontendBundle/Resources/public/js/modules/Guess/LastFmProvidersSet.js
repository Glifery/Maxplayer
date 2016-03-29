define([
    'Pool/ArtistPoolService',
    'Pool/AlbumPoolService',
    'Pool/TrackPoolService'
], function (
    ArtistPoolService,
    AlbumPoolService,
    TrackPoolService
) {
    var LastFmProvidersSetClass = LastFmProvidersSet;
    LastFmProvidersSetClass.prototype.createSearchPromise = _createSearchPromise;

    function LastFmProvidersSet() {}

    function _createSearchPromise(query, artistCallback, albumCallback, trackCallback) {
        var promises = [
            ArtistPoolService.search(query).then(_fireCallback(artistCallback)),
            AlbumPoolService.search(query).then(_fireCallback(albumCallback)),
            TrackPoolService.search(query).then(_fireCallback(trackCallback))
        ];

        return Promise.all(promises);
    }

    function _fireCallback(callback) {
        return function(collection) {
            if (typeof callback !== 'function') {
                return;
            }

            callback(collection);
        }
    }

    return new LastFmProvidersSetClass();
});