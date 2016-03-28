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

    var lastfm = new Resource({
        url: 'http://ws.audioscrobbler.com/2.0/',
        method: 'GET',
        params: {
            api_key: lastfmConnect.apiKey,
            format: 'json'
        },
        done: _catchError
    });

    lastfm
        .addRoute('artistSearch', {
            params: {
                method: 'artist.search',
                limit: 5
            },
            done: function(response) {
                return response.results.artistmatches.artist;
            }
        })
        .addRoute('artistGetInfo', {
            params: {
                method: 'artist.getInfo',
                autocorrect: 1
            }
        })
        .addRoute('artistGetSimilar', {
            params: {
                method: 'artist.getSimilar',
                autocorrect: 1,
                limit: 10
            },
            done: function(response) {
                return response.similarartists.artist;
            }
        })
        .addRoute('artistGetAlbums', {
            params: {
                method: 'artist.getTopAlbums',
                autocorrect: 1,
                limit: 30
            },
            done: function(response) {
                return response.topalbums.album;
            }
        })
        .addRoute('artistGetTopTracks', {
            params: {
                method: 'artist.getTopTracks',
                autocorrect: 1,
                limit: 50
            },
            done: function(response) {
                return response.toptracks.track;
            }
        })
        .addRoute('albumSearch', {
            params: {
                method: 'album.search',
                limit: 5
            },
            done: function(response) {
                return response.results.albummatches.album;
            }
        })
        .addRoute('trackSearch', {
            params: {
                method: 'track.search',
                limit: 5
            },
            done: function(response) {
                return response.results.trackmatches.track;
            }
        })
        .addRoute('trackGetSimilar', {
            params: {
                method: 'track.getSimilar',
                autocorrect: 1,
                limit: 10
            },
            done: function(response) {
                return response.similartracks.track;
            }
        })
        .addRoute('tagSearch', {
            params: {
                method: 'tag.search',
                limit: 5
            }
        })
        .addRoute('tagGetSimilar', {
            params: {
                method: 'tag.getSimilar',
                limit: 10
            }
        })
    ;

    function _catchError(responce) {
        if (responce.hasOwnProperty('error')) {
            throw new Error('LastFM API error (' + responce['error'] + '): ' + responce['message']);
        }

//        return responce;
    }

    return lastfm;
});