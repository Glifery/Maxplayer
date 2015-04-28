define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
    ) {

    var CollectionElement = Backbone.Model.extend({
        defaults: {
            domain: null,
            sort: null
        }
    });

    return CollectionElement;
});