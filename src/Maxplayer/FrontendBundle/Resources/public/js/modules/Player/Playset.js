define([
    'Utils/CheckType',
    'backbone',
    'Utils/PromiseChain',
    'Domain/Collection'
], function(
    checkType,
    Backbone,
    PromiseChain,
    Collection
){
    var Playset = Backbone.Model.extend({
        defaults: {
            mix: 'default'
        },
        _collection: new Collection(),

        getCollection: function() {
            return this._collection;
        },

        set: function(domain) {
            this.reset();
            this.add(domain);
        },

        add: function(domain) {
            if (!checkType.obj(domain)) {
                throw new Error('Attempt to add non-object to Playset.');
            }

            this._collection.addDomainUnique(domain);

            return this;
        },

        reset: function() {
            this._collection.reset();
            this.trigger('reset');

            return this;
        },

        getNextTrack: function() {
            //TODO: get artist's track, etc.
            var domain = this._collection.getDomains()[Math.floor(Math.random() * this._collection.length)];

            if (!domain) {
                return Promise.reject();
            }

            switch (domain['domain']) {
                case 'artist':
                    return new PromiseChain()
                        .then(function() {
                            console.log('........Playset.getTopTracks');
                            return domain.getTopTracks();
                        })
                        .then(returnOneFromCollection)
                    ;
                case 'album':
                    return domain.getTracks().then(returnOneFromCollection);
                case 'track':
                    return Promise.resolve(domain);
                default:
                    return Promise.reject();
            }
        }
    });

    function returnOneFromCollection(collection) {
        console.log('........Playset.returnOneFromCollection');

        if (!collection.length) {
            return Promise.reject();
        }

        var track = collection.at([Math.floor(Math.random() * collection.length)]).get('domain');

        return Promise.resolve(track);
    }

    return Playset;
});