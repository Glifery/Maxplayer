define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Domain/Domain'
], function (
    CheckType,
    Debug,
    Backbone,
    Domain
) {
    var domain = 'artist';

    var Artist = Domain.extend({
        defaults: {
            name: null,
            mbid: null,
            images: null
        },
        domain: domain
    });

    return Artist;
});