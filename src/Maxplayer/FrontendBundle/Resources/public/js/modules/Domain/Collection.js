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

            return this;
        },

        addDomainUnique: function(domain, sort) {
            var hasDomainFound = this.find(function(collectionElement) {
                return collectionElement.get('domain') === domain;
            });

            if (hasDomainFound) {
                return this;
            }

            this.addDomain(domain, sort);
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
