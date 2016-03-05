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

        initialize: function() {
            this.get('prevCollection').on('add', propagateEventFor(this, 'add:prevCollection', true));
            this.get('prevCollection').on('remove', propagateEventFor(this, 'remove:prevCollection', true));
            this.get('prevCollection').on('update', propagateEventFor(this, 'update:prevCollection'));
            this.get('nextCollection').on('add', propagateEventFor(this, 'add:nextCollection', true));
            this.get('nextCollection').on('remove', propagateEventFor(this, 'remove:nextCollection', true));
            this.get('nextCollection').on('update', propagateEventFor(this, 'update:nextCollection'));
        },

        loadNextTrack: function() {
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
                return this.loadNextTrack().then(_.bind(this.gotoNextTrack, this));
            }

            this.set('current', track);
            this.get('prevCollection').addDomain(track);

            return Promise.resolve(track);
        }
    });

    function propagateEventFor(playlist, collectionName, isDomain) {
        return function(domainOrCollection, collectionOrEvent) {
            var collection = null,
                track = null
            ;

            if (isDomain) {
                track = domainOrCollection.get('domain');
                collection = collectionOrEvent;
            } else {
                collection = domainOrCollection;
            }

            playlist.trigger(collectionName, collection, track);
        }
    }

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