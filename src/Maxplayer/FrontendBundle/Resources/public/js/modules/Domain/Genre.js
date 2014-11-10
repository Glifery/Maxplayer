define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
) {
    var Genre = Backbone.Model.extend({
        defaults: {
            name: null,
            mbid: null,
            listeners: null,

            smallImage: null,
            mediumImage: null,
            fullImage: null,

            similarGenres: null,
            topArtists: null,
            topAlbums: null,
            topTracks: null
        }
    });

    return Genre;
});