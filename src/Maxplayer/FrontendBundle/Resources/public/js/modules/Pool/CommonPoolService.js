define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/SpotifyResourceService',
    'Domain/Artist',
    'Domain/Album',
    'Domain/Track'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    MusicResourceService,
    Artist,
    Album,
    Track
) {
    var CommonPoolServiceClass = CommonPoolService;
    CommonPoolServiceClass.prototype = new DomainPool;

    CommonPoolServiceClass.prototype.search = _search;

    var parametersMap = {
        artist: {
            name: 'artist',
            domainCode: 'artist',
            response: 'artists',
            newDomainFunction: function() {return new Artist;}
        },
        album: {
            name: 'album',
            domainCode: 'album',
            response: 'albums',
            newDomainFunction: function() {return new Album;}
        },
        track: {
            name: 'track',
            domainCode: 'track',
            response: 'tracks',
            newDomainFunction: function() {return new Track;}
        }
    };

    function CommonPoolService() {}

    function _search(query) {
        var _this = this,
            request = {
                'q': query
                //'type': 'album,artist,track'
            }
        ;

        return MusicResourceService
            .search(request)
            .then(function(response) {
                    return {
                        'artist': _fetchCollection('artist', response, _this),
                        'album': _fetchCollection('album', response, _this),
                        'track': _fetchCollection('track', response, _this)
                    };
                },
                function(response) {
                    console.log('REJECT search()', response);
                }
            )
        ;
    }

    function _fetchCollection(domainCode, response, domainPool) {
        var parameters = parametersMap[domainCode];

        domainPool.domainCode = parameters.domainCode;
        domainPool.createNewDomain = parameters.newDomainFunction;

        return domainPool.populateCollection(response[parameters.response]['items'])
    }

    function _createNewDomain() {
        return new Artist;
    }

    return new CommonPoolServiceClass();
});
