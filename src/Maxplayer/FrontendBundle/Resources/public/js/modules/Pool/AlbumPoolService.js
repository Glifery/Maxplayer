define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Album',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Album,
    Collection
) {
    var AlbumPoolServiceClass = AlbumPoolService;
    AlbumPoolServiceClass.prototype = new DomainPool;
    AlbumPoolServiceClass.prototype.domainCode = 'album';
    AlbumPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    AlbumPoolServiceClass.prototype.search = _search;

    function AlbumPoolService() {}

    function _search(albumName) {
        var _this = this,
            request = {'album': albumName}
        ;

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .albumSearch(request)
                .then(function(responce) {
                    var collection = new Collection();

                    _.each(responce.results.albummatches.album, function(item) {
                        var domain = _this.findOrCreate(item);

                        collection.addDomain(domain);
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
        return new Album;
    }

    return new AlbumPoolServiceClass();
});
