define([
    'Utils/CheckType',
    'Utils/Debug',
    'Utils/Resource'
], function (
    CheckType,
    Debug,
    Resource
) {
    lastfmConnect = {
        apiKey: 'fa8a3b21a540363fa91c6ae12a7a35e3',
        apiSecret: '2708824bc8f3b18ee53b17561adcaedc'
    }

    var vk = new Resource({
        url: 'http://maxplayer.my/app_dev.php/rest/',
        method: 'POST',
        done: _catchError
    });

    vk
        .addRoute('trackSound', {
            url: 'track/sound'
        })
    ;

    function _catchError(responce) {
        if (!responce.hasOwnProperty('status') || (responce.status == 'error')) {
            if (responce.hasOwnProperty('errors') && CheckType.arr(responce.errors)) {
                throw new Error('VK API error (' + responce.errors.join(' ,') + ')');
            } else {
                throw new Error('VK API error (unknown)');
            }
        }
    }

    return vk;
});