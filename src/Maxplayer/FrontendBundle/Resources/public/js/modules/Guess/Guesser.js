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
            genre: new Collection,
            artist: new Collection,
            track: new Collection,
            album: new Collection
        },
        initialize: function() {
            this.on('change:query', this.submit);
        },
        submit: function() {
            var that = this,
                query = this.get('query')
            ;

            ProvidersSet
                .searchArtist(query)
                .then(function(collection) {
                    that.set('artist', collection);
                })
            ;
        }
    });

    return Guesser;
});