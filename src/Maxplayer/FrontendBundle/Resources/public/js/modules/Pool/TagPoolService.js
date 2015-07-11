define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Tag',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Tag,
    Collection
) {
    var TagPoolServiceClass = TagPoolService;
    TagPoolServiceClass.prototype = new DomainPool;
    TagPoolServiceClass.prototype.domainCode = 'tag';
    TagPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    TagPoolServiceClass.prototype.getSimilar = _getSimilar;
    TagPoolServiceClass.prototype.search = _search;

    function TagPoolService() {}

    function _getSimilar(domain) {
        var _this = this,
            request = this.createRequestByDomain(domain, this.domainCode)
        ;
        console.log('similar to', request);

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .tagGetSimilar(request)
                .then(function(responce) {
                        var collection = new Collection();

                        _.each(responce.similartags.tag, function(item) {
                            var domain = _this.findOrCreate(item),
                                sort = parseFloat(item.match)
                            ;

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

    function _search(tagName) {
        var _this = this,
            request = {'tag': tagName}
        ;

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .tagSearch(request)
                .then(function(responce) {
                    var collection = new Collection();

                    _.each(responce.results.tagmatches.tag, function(item) {
                        var domain = _this.findOrCreate(item);

                        collection.addDomain(domain, 'count');
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
        return new Tag;
    }

    return new TagPoolServiceClass();
});
