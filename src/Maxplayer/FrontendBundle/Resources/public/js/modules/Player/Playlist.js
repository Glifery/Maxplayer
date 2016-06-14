define([
    'underscore',
    'backbone',
    'Utils/PromiseChain',
    'Domain/Collection'
], function(
    _,
    Backbone,
    PromiseChain,
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

            this.chainOn('playset', 'reset', function() {
                console.log('RESET!!');
                this.get('nextCollection').reset();
            }, this)
        },

        loadNextTrack: function() {
            var _this = this;

            if (!this.get('playset')) {
                throw new Error('Playset is not set in current Playlist');
            }

            return new PromiseChain()
                .then(function() {
                    console.log('......Playlist.getNextTrack');
                    return _this.get('playset').getNextTrack();
                })
                .then(pushToNextCollection(this))
            ;
        },

        gotoNextTrack: function() {
            var _this = this;

            return new PromiseChain()
                .then(function() {
                    if (!_this.get('nextCollection').length) {
                        return _this.loadNextTrack();
                    }
                })
                .then(function() {
                    var track = pullTrackFromNextCollection(_this);
                    makeTrackCurrent(_this, track);

                    return Promise.resolve(track);
                })
            ;
        }
    });

    function makeTrackCurrent(playlist, track) {
        playlist.set('current', track);
        playlist.get('prevCollection').addDomain(track);
    }

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
            console.log('......Playlist.pushToNextCollection');
            playlist.get('nextCollection').addDomain(track);

            return track;
        }
    }

    return Playlist;
});