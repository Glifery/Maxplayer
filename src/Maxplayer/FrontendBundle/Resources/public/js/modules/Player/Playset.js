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
            this._collection = new Collection()
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

        getNext: function() {
            console.log('function getNext');

            var domain = this._collection.first().get('domain');
            console.log('domain:', domain);

            //TODO: get artist's track, etc.

            return domain;
        }
    });

    return Playset;
});