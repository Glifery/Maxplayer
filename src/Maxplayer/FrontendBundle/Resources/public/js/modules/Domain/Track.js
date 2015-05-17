define([
    'Domain/Domain'
], function (
    Domain
) {
    var domain = 'track';

    var Track = Domain.extend({
        defaults: {
            name: null,
            artist: null,
            images: null
        },
        domain: domain
    });

    return Track;
});