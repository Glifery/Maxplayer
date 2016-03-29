define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/SpotifyResourceService',
    'Domain/Album',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    MusicResourceService,
    Album,
    Collection
) {
    var AlbumPoolServiceClass = AlbumPoolService;
    AlbumPoolServiceClass.prototype = new DomainPool;
    AlbumPoolServiceClass.prototype.domainCode = 'album';
    AlbumPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    AlbumPoolServiceClass.prototype.artistGetAlbums = _artistGetAlbums;
    AlbumPoolServiceClass.prototype.trackGetAlbum = _trackGetAlbum;

    function AlbumPoolService() {}

    function _artistGetAlbums(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return MusicResourceService
            .artistGetAlbums(request)
            .then(function(response) {
                    return _this.populateCollection(response, function(album) {
                        album._relation_album = artist;
                        album.set('album', artist.get('name'));
                    });
                },
                function(response) {
                    console.log('REJECT artistGetAlbums()', response);
                }
            )
        ;
    }

    function _trackGetAlbum(track) {
        var _this = this,
            request = this.createRequestByDomain(track, 'track')
        ;

        return MusicResourceService
            .trackGetInfo(request)
            .then(function(response) {
                    var album = _this.findOrCreate(response.album);

                    return album;
                },
                function(response) {
                    console.log('REJECT artistGetInfo()', response);
                }
            )
        ;
    }

    function _search(albumName) {
        var _this = this,
            request = {'album': albumName}
        ;

        return MusicResourceService
            .albumSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response);
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
