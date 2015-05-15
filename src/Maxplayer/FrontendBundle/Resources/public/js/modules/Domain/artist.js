define([
    'Domain/Domain'
], function (
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