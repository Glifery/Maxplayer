define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Collection',
    'Domain/Artist'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Collection,
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
                        var collection = new Collection();

                        _.each(responce.similarartists.artist, function(item) {
                            var domain = _this.findOrCreate(item),
                                sort = parseFloat(item.match);

                            collection.addDomain(domain, sort);
                        });

                        resolve(collection);
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
