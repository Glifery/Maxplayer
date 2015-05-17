define([
    'Pool/ArtistPoolService',
    'Pool/AlbumPoolService',
    'Pool/TrackPoolService',
    'Pool/TagPoolService'
], function (
    ArtistPoolService,
    AlbumPoolService,
    TrackPoolService,
    TagPoolService
) {
    var ProvidersSetClass = ProvidersSet;
    ProvidersSetClass.prototype.searchArtist = _searchArtist;
    ProvidersSetClass.prototype.searchAlbum = _searchAlbum;
    ProvidersSetClass.prototype.searchTrack = _searchTrack;
    ProvidersSetClass.prototype.searchTag = _searchTag;

    function ProvidersSet() {}

    function _searchArtist(query) {
        return ArtistPoolService.search(query);
    }
    function _searchAlbum(query) {
        return AlbumPoolService.search(query);
    }
    function _searchTrack(query) {
        return TrackPoolService.search(query);
    }
    function _searchTag(query) {
        return TagPoolService.search(query);
    }

    return new ProvidersSetClass();
});