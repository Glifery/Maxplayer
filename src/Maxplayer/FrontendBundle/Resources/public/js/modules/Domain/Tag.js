define([
    'Domain/Domain'
], function (
    Domain
) {
    var domain = 'tag';

    var Tag = Domain.extend({
        defaults: {
            name: null
        },
        domain: domain
    });

    return Tag;
});