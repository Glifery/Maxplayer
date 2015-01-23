define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Artist'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Artist
) {
    var ArtistPoolServiceClass = ArtistPoolService;
    ArtistPoolServiceClass.prototype = new DomainPool;
    ArtistPoolServiceClass.prototype.domainCode = 'artist';
    ArtistPoolServiceClass.prototype.createNewDomain = _createNewDomain;
    ArtistPoolServiceClass.prototype.getSimilar = _getSimilar;

    function ArtistPoolService() {}

    function _getSimilar(domain) {
        var _this = this,
            request = this.createRequestByDomain(domain, this.domainCode);

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .artistGetSimilar(request)
                .then(function(responce) {
                        var artists = _.map(responce.similarartists.artist, function(item, key) {
                            return _this.findOrCreate(item);
                        });

                        resolve(artists);
                    },
                    function(responce) {
                        reject(responce);
                    }
                )
            ;
        });
    }

    function _createNewDomain() {
        return new Artist;
    }

    return new ArtistPoolServiceClass();
});
