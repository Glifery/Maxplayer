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
    ArtistPoolServiceClass.prototype.createNewDomain = _createNewDomain;
    ArtistPoolServiceClass.prototype.domainCode = 'artist';

    ArtistPoolServiceClass.prototype.artistGetSimilar = _artistGetSimilar;
    ArtistPoolServiceClass.prototype.trackGetArtist = _trackGetArtist;
    ArtistPoolServiceClass.prototype.search = _search;

    function ArtistPoolService() {}

    function _artistGetSimilar(artist) {
        var _this = this,
            request = this.createRequestByDomain(artist, 'artist')
        ;

        return LastFmResourceService
            .artistGetSimilar(request)
            .then(function(response) {
                    return _this.populateCollection(response.similarartists.artist, function(item) {return item.match});
                },
                function(response) {
                    console.log('REJECT artistGetSimilar()', response);
                }
            )
        ;
    }

    function _trackGetArtist(track) {
        var _this = this,
            request = {'artist': track.get('artist')}
        ;

        return LastFmResourceService
            .artistGetInfo(request)
            .then(function(response) {
                    var artist = _this.findOrCreate(response.artist);

                    return artist;
                },
                function(response) {
                    console.log('REJECT artistGetInfo()', response);
                }
            )
        ;
    }

    function _search(artistName) {
        var _this = this,
            request = {'artist': artistName}
        ;

        return LastFmResourceService
            .artistSearch(request)
            .then(function(response) {
                    return _this.populateCollection(response.results.artistmatches.artist, null);
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
