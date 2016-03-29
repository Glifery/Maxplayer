define([
    'backbone',
    'Domain/Collection',
    'Guess/SpotifyProvidersSet'
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

            ProvidersSet.createSearchPromise(
                    query,
                    _getCallbackFor(_this, 'artist'),
                    _getCallbackFor(_this, 'album'),
                    _getCallbackFor(_this, 'track')
                ).then(function() {
                    _this.trigger('change:all', _this);
                })
            ;
        }
    });

    function _getCallbackFor(guesser, domainCode) {
        return function(collection) {
            guesser.set(domainCode, collection);
        }
    }

    return Guesser;
});