define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Track',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Track,
    Collection
) {
    var TrackPoolServiceClass = TrackPoolService;
    TrackPoolServiceClass.prototype = new DomainPool;
    TrackPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    TrackPoolServiceClass.prototype.trackGetSimilar = _trackGetSimilar;
    TrackPoolServiceClass.prototype.artistGetTopTracks = _artistGetTopTracks;
    TrackPoolServiceClass.prototype.search = _search;

    function TrackPoolService() {}

    function _trackGetSimilar(domain) {
        var _this = this,
            request = this.createRequestByDomain(domain, 'track')
        ;

        return LastFmResourceService
            .trackGetSimilar(request)
            .then(function(response) {
                    return _this.populateCollection(response.similartracks.track, function(item) {return item.match});
                },
                function(response) {
                    console.log('REJECT trackGetSimilar()', response);
                }
            )
        ;
    }

    function _artistGetTopTracks(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return LastFmResourceService
            .artistGetTopTracks(request)
            .then(function(response) {
                return _this.populateCollection(response.toptracks.track, function(item) {return item.listeners});
            },
            function(response) {
                console.log('REJECT artistGetTopTracks()', response);
            })
        ;
    }

    function _search(trackName) {
        var _this = this,
            request = {'track': trackName}
        ;

        return LastFmResourceService
            .trackSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response.results.trackmatches.track, null);
                },
                function(response) {
                    console.log('REJECT trackSearch()', response);
                }
            )
        ;
    }

    function _createNewDomain() {
        return new Track;
    }

    return new TrackPoolServiceClass();
});
