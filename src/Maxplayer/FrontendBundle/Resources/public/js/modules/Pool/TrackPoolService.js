define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/SpotifyResourceService',
    'Domain/Track'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    MusicResourceService,
    Track
) {
    var TrackPoolServiceClass = TrackPoolService;
    TrackPoolServiceClass.prototype = new DomainPool;
    TrackPoolServiceClass.prototype.domainCode = 'track';
    TrackPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    TrackPoolServiceClass.prototype.artistGetTopTracks = _artistGetTopTracks;
    TrackPoolServiceClass.prototype.albumGetTracks = _albumGetTracks;
    TrackPoolServiceClass.prototype.trackGetSimilar = _trackGetSimilar;

    function TrackPoolService() {}

    function _artistGetTopTracks(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return MusicResourceService
            .artistGetTopTracks(request)
            .then(function(response) {
                return _this.populateCollection(response);
            },
            function(response) {
                console.log('REJECT artistGetTopTracks()', response);
            })
        ;
    }

    function _albumGetTracks(album) {
        var _this = this,
            request = this.createRequestByDomain(album, 'album')
        ;

        return MusicResourceService
            .albumGetTracks(request)
            .then(function(response) {
                return _this.populateCollection(response, function(track) {
                    track._relation_album = album;
                    track.set('album', album);
                });
            },
            function(response) {
                console.log('REJECT albumGetTracks()', response);
            })
            ;
    }

    function _trackGetSimilar(domain) {
        var _this = this,
            request = this.createRequestByDomain(domain, 'track')
        ;

        return MusicResourceService
            .trackGetSimilar(request)
            .then(function(response) {
                    return _this.populateCollection(response);
                },
                function(response) {
                    console.log('REJECT trackGetSimilar()', response);
                }
            )
        ;
    }

    function _search(trackName) {
        var _this = this,
            request = {'track': trackName}
        ;

        return MusicResourceService
            .trackSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response);
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
