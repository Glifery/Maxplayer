define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'backbone',
    'Domain/Collection'
], function(
    checkType,
    debug,
    _,
    Backbone,
    Collection
){
    var Playlist = Backbone.Model.extend({
        defaults: {
            playset: null,
            current: null,
            prevCollection: new Collection(),
            nextCollection: new Collection()
        },

        initialize: function(playset) {
            if (playset) {
                this.set('playset', playset);
            }
        },

        loadNext: function(amount) {
            if (!amount) {
                amount = 1;
            }

            if (!this.get('playset')) {
                throw new Error('Playset is not set in current Playlist');
            }

            return this.get('playset')
                .getNextTrack()
                .then(addToNextCollection(this))
            ;
        },

        gotoNextTrack: function() {
            if (!this.get('nextCollection') || !this.get('nextCollection').size()) {
                return this.loadNext(1).then(_.bind(this.gotoNextTrack, this));
            }

            var nextElement = this.get('nextCollection').shift();
            this.get('prevCollection').addDomain(nextElement.get('domain'));

            return Promise.resolve(nextElement.get('domain'));
        }
    });

    function addToNextCollection(playlist) {
        return function(track) {
            playlist.get('nextCollection').addDomain(track);
        }
    }

    return Playlist;
});