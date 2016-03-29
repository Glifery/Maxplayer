define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/SpotifyResourceService',
    'Domain/Artist'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    MusicResourceService,
    Artist
) {
    var ArtistPoolServiceClass = ArtistPoolService;
    ArtistPoolServiceClass.prototype = new DomainPool;
    ArtistPoolServiceClass.prototype.domainCode = 'artist';
    ArtistPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    ArtistPoolServiceClass.prototype.artistGetSimilar = _artistGetSimilar;
    ArtistPoolServiceClass.prototype.albumGetArtist = _albumGetArtist;
    ArtistPoolServiceClass.prototype.trackGetArtist = _trackGetArtist;

    function ArtistPoolService() {}

    function _artistGetSimilar(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return MusicResourceService
            .artistGetSimilar(request)
            .then(function(response) {
                    return _this.populateCollection(response);
                },
                function(response) {
                    console.log('REJECT artistGetSimilar()', response);
                }
            )
        ;
    }

    function _albumGetArtist(album) {
        var _this = this,
            request = this.createRequestByDomain(album, 'album')
        ;

        return MusicResourceService
            .albumGetInfo(request)
            .then(function(response) {
                    var artist = _this.findOrCreate(response.artist[0]);

                    return artist;
                },
                function(response) {
                    console.log('REJECT albumGetInfo()', response);
                }
            )
        ;
    }

    function _trackGetArtist(track) {
        var _this = this,
            request = this.createRequestByDomain(track, 'track')
        ;

        return MusicResourceService
            .trackGetInfo(request)
            .then(function(response) {
                    var artist = _this.findOrCreate(response.artist[0]);

                    return artist;
                },
                function(response) {
                    console.log('REJECT trackGetInfo()', response);
                }
            )
        ;
    }

    function _search(artistName) {
        var _this = this,
            request = {'artist': artistName}
        ;

        return MusicResourceService
            .artistSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response);
                },
                function(response) {
                    console.log('REJECT artistSearch()', response);
                }
            )
        ;
    }

    function _createNewDomain() {
        return new Artist;
    }

    return new ArtistPoolServiceClass();
});
