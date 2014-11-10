define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
) {
    var Album = Backbone.Model.extend({
        defaults: {
            name: null,
            mbid: null,
            year: null,
            listeners: null,

            smallImage: null,
            mediumImage: null,
            fullImage: null,

            similarAlbums: null,
            genres: null,
            artist: null,
            tracks: null
        }
    });

    return Album;
});