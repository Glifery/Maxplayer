define([
    'Utils/CheckType',
    'Utils/Debug',
    'Utils/Resource'
], function (
    CheckType,
    Debug,
    $resource
) {
    lastfmConnect = {
        apiKey: 'fa8a3b21a540363fa91c6ae12a7a35e3',
        apiSecret: '2708824bc8f3b18ee53b17561adcaedc'
    }

    var lastfm = $resource.create({
        url: 'http://ws.audioscrobbler.com/2.0/',
        method: 'GET',
        params: {
            api_key: lastfmConnect.apiKey,
            format: 'json'
        }
    });

    lastfm
        .addRoute('artistSearch', {
            params: {
                method: 'artist.search'
            }
        })
        .addRoute('artistGetSimilar', {
            params: {
                method: 'artist.getSimilar',
                autocorrect: 1,
                limit: 10
            }
        })
    ;

    lastfm.catchError = _catchError;

    function _catchError(responce) {
        if (responce.hasOwnProperty('error')) {
            return 'LastFM API error (' + responce['error'] + '): ', responce['message'];
        }

        return null;
    }

    return lastfm;
});