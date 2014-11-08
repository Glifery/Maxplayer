define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    checkType,
    debug,
    Backbone
) {
    var Track = Backbone.Model.extend({
        defaults: {
            name: null,
            artist: null,
            url: null,
            image: null,
            streamable: null,
            listeners: null
        },
        initialize: function(){
        }
    });

    return Track;
});