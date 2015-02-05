define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Domain/Domain',
    'Domain/CollectionElement'
], function (
    CheckType,
    Debug,
    Backbone,
    Domain,
    CollectionElement
    ) {

    var Collection = Backbone.Collection.extend({
        model: Domain,

        addDomain: function(domain, sort) {
            var element = new CollectionElement({
                domain: domain,
                sort: sort
            });

            this.add(element);
        },

        getDomains: function(amount) {
            return this.map(function(element) {
                return element.get('domain');
            })
        },

        comparator: function(element) {
            return - element.get("sort");
        }
    });

    return Collection;
});
