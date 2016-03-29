define([
    'Pool/CommonPoolService'
], function (
    CommonPoolService
) {
    var SpotifyProvidersSetClass = SpotifyProvidersSet;
    SpotifyProvidersSetClass.prototype.createSearchPromise = _createSearchPromise;

    function SpotifyProvidersSet() {}

    function _createSearchPromise(query, artistCallback, albumCallback, trackCallback) {
        return CommonPoolService
            .search(query)
            .then(function(searchResults) {
                _fireCallback(searchResults, 'artist', artistCallback);
                _fireCallback(searchResults, 'album', albumCallback);
                _fireCallback(searchResults, 'track', trackCallback);
        });
    }

    function _fireCallback(searchResults, domainCode, callback) {
        if ((!searchResults.hasOwnProperty(domainCode)) || !searchResults[domainCode]) {
            return;
        }

        if (typeof callback !== 'function') {
            return;
        }

        callback(searchResults[domainCode]);
    }

    return new SpotifyProvidersSetClass();
});