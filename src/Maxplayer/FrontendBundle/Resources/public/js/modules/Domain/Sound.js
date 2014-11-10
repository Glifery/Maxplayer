define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
) {
    var Sound = Backbone.Model.extend({
        defaults: {
            artistName: null,
            trackName: null,
            duration: null,
            src: null,

            artist: null,
            track: null
        }
    });

    return Sound;
});