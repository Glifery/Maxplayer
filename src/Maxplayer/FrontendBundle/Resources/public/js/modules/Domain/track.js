define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
) {
    var Track = Backbone.Model.extend({
        defaults: {
            name: null,
            artist: null,
            duration: null,
            listeners: null,

            smallImage: null,
            mediumImage: null,
            fullImage: null,

            similarTracks: null,
            genres: null,
            artist: null,
            album: null,
            sound: null
        }
    });

    return Track;
});