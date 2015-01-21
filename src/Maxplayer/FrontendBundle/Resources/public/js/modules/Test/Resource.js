//http://maxplayer.my/app_dev.php/test/module/Test-Resource

define([
    'Utils/Resource'
], function (
    Resource
) {
    var lastfmConnect = {
        apiKey: 'fa8a3b21a540363fa91c6ae12a7a35e3',
        apiSecret: '2708824bc8f3b18ee53b17561adcaedc'
    }

    var resource = new Resource({
        url: 'http://ws.audioscrobbler.com/2.0/',
        method: 'GET',
        params: {
            api_key: lastfmConnect.apiKey,
            format: 'json'
        },
        done: function(res) {console.log('--DONE with', res); /*throw new Error('112233');*/ return 123;},
        fail: function(res) {console.log('--FAIL with', res); /*throw new Error('112233');*/ return 123;},
        then: function(res) {console.log('--THEN with', res); /*throw new Error('112233');*/ return 123;}
    });

    resource
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

    resource
        .artistGetSimilar({artist: 'ABBA'})
        .then(
            function(result) {
                console.log('----RESOLVE with', result);
            },
            function(result) {
                console.log('----REJECT with', result);
            }
        )
    ;
});