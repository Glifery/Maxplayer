define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    checkType,
    debug,
    Backbone
) {
    var Artist = Backbone.Model.extend({
        defaults: {
            name: null,
            mbid: null,
            url: null,
            image_small: null,
            image: null,
            streamable: null
        },
        initialize: function() {
        },
        getQuery: function() {
            var mbid = this.get('mbid'),
                query = {};

            if (mbid.length) {
                return {mbid: mbid};
            }

            return {name: this.get('name')};
        }
    });

    return Artist;
});