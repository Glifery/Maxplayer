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
    TrackPoolServiceClass.prototype.domainCode = 'track';
    TrackPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    TrackPoolServiceClass.prototype.getSimilar = _getSimilar;
    TrackPoolServiceClass.prototype.search = _search;

    function TrackPoolService() {}

    function _getSimilar(domain) {
        var _this = this,
            request = this.createRequestByDomain(domain, this.domainCode)
        ;

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .trackGetSimilar(request)
                .then(function(response) {
                        var collection = new Collection();

                        _.each(response.similartracks.track, function(item) {
                            var domain = _this.findOrCreate(item),
                                sort = parseFloat(item.match)
                            ;

                            collection.addDomain(domain, sort);
                        });

                        resolve(collection);
                    },
                    function(response) {
                        reject(response);
                    }
                )
            ;
        });
    }

    function _search(trackName) {
        var _this = this,
            request = {'track': trackName}
        ;

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .trackSearch(request)
                .then(function(response) {
                    var collection = new Collection();

                    _.each(response.results.trackmatches.track, function(item) {
                        var domain = _this.findOrCreate(item);

                        collection.addDomain(domain);
                    });

                    resolve(collection);
                },
                function(response) {
                    reject(response);
                }
            )
            ;
        });
    }

    function _createNewDomain() {
        return new Track;
    }

    return new TrackPoolServiceClass();
});
