define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Domain/Collection'
], function(
    checkType,
    debug,
    Backbone,
    Collection
){
    var Playset = Backbone.Model.extend({
        defaults: {
            mix: 'default'
        },
        _collection: null,

        initialize: function() {
            this._collection = new Collection();
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

            return this;
        },

        getNextTrack: function() {
            //TODO: get artist's track, etc.

            return Promise.resolve(this._collection.getDomains()[Math.floor(Math.random() * this._collection.length)]);
        }
    });

    return Playset;
});