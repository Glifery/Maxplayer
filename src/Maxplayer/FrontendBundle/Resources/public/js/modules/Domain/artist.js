define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
) {
    var Artist = Backbone.Model.extend({
        defaults: {
            name: null,
            mbid: null,
            listeners: null,

            smallImage: null,
            mediumImage: null,
            fullImage: null,

            similarArtists: null,
            genres: null,
            albums: null,
            topTracks: null
        }
    });

    return Artist;
});