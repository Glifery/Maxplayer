define([
    'backbone',
    'Domain/Collection',
    'Guess/ProvidersSet'
], function (
    Backbone,
    Collection,
    ProvidersSet
) {
    var Guesser = Backbone.Model.extend({
        defaults: {
            query: '',
            artist: new Collection,
            album: new Collection,
            track: new Collection
        },

        initialize: function() {
            this.on('change:query', this.submit);
        },

        submit: function() {
            var _this = this,
                query = this.get('query'),
                promises = []
            ;

            if (!query.length) {
                return;
            }

            promises = [
                ProvidersSet
                    .searchArtist(query)
                    .then(function(collection) {
                        _this.set('artist', collection);
                    })
                ,

                ProvidersSet
                    .searchAlbum(query)
                    .then(function(collection) {
                        _this.set('album', collection);
                    })
                ,

                ProvidersSet
                    .searchTrack(query)
                    .then(function(collection) {
                        _this.set('track', collection);
                    })

            ];

            Promise
                .all(promises)
                .then(function() {
                    _this.trigger('change:all', _this);
                })
            ;
        }
    });

    return Guesser;
});