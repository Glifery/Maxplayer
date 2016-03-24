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

    AlbumPoolServiceClass.prototype.artistGetTopAlbums = _artistGetTopAlbums;
    AlbumPoolServiceClass.prototype.search = _search;

    function AlbumPoolService() {}

    function _artistGetTopAlbums(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return LastFmResourceService
            .artistGetTopAlbums(request)
            .then(function(response) {
                    return _this.populateCollection(response.topalbums.album, null, _this.setParentRelation('artist', artist));
                },
                function(response) {
                    console.log('REJECT artistGetTopAlbums()', response);
                }
            )
        ;
    }

    function _search(albumName) {
        var _this = this,
            request = {'album': albumName}
        ;

        return LastFmResourceService
            .albumSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response.results.albummatches.album, null);
                },
                function(response) {
                    console.log('REJECT albumSearch()', response);
                }
            )
        ;
    }

    function _createNewDomain() {
        return new Album;
    }

    return new AlbumPoolServiceClass();
});
