define([
    'Domain/Domain'
], function (
    Domain
) {
    var domain = 'album';

    var Album = Domain.extend({
        defaults: {
            name: null,
            artist: null,
            id: null,
            images: null
        },
        domain: domain
    });

    return Album;
});