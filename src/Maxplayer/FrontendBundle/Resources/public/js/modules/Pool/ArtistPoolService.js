define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Pool/DomainPool',
    'Api/LastFmResourceService',
    'Domain/Artist',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    DomainPool,
    LastFmResourceService,
    Artist,
    Collection
) {
    var ArtistPoolServiceClass = ArtistPoolService;
    ArtistPoolServiceClass.prototype = new DomainPool;
    ArtistPoolServiceClass.prototype.createNewDomain = _createNewDomain;

    ArtistPoolServiceClass.prototype.artistGetSimilar = _artistGetSimilar;
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
