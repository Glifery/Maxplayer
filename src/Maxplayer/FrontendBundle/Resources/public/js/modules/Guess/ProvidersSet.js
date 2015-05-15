define([
    'Pool/ArtistPoolService'
], function (
    ArtistPoolService
) {
    var ProvidersSetClass = ProvidersSet;
    ProvidersSetClass.prototype.searchArtist = _searchArtist;

    function ProvidersSet() {}

    function _searchArtist(query) {
        return ArtistPoolService.search(query);
    }

    return new ProvidersSetClass();
});