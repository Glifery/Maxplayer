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

        loadNext: function() {
            if (!this.get('playset')) {
                throw new Error('Playset is not set in current Playlist');
            }

            return this.get('playset')
                .getNextTrack()
                .then(pushToNextCollection(this))
            ;
        },

        gotoNextTrack: function() {
            var track = pullTrackFromNextCollection(this);

            if (!track) {
                return this.loadNext().then(_.bind(this.gotoNextTrack, this));
            }

            this.get('prevCollection').addDomain(track);
            this.set('current', track);

            return Promise.resolve(track);
        }
    });

    function pullTrackFromNextCollection(playlist) {
        var nextElement = playlist.get('nextCollection').shift();

        if (!nextElement) {
            return null;
        }

        return nextElement.get('domain');
    }

    function pushToNextCollection(playlist) {
        return function(track) {
            playlist.get('nextCollection').addDomain(track);
        }
    }

    return Playlist;
});