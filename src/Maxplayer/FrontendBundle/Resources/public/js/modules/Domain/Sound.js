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
    var Sound = Domain.extend({
        defaults: {
            artist: '',
            title: '',
            duration: 0,
            url: null,
            stream: null,
            loadPosition: 0,
            playPosition: 0
        }
    });

    return Sound;
});