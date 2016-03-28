define([
    'Utils/CheckType',
    'Utils/Debug',
    'Utils/Resource'
], function (
    CheckType,
    Debug,
    Resource
) {
    var spotify = new Resource({
        url: 'https://api.spotify.com/v1/',
        method: 'GET',
        done: _catchError
    });

    spotify
        .addRoute('search', {
            url: 'search/',
            params: {
                type: 'album,artist,track',
                limit: 10
            }
        })
        .addRoute('artistGetInfo', {
            url: 'artists/{id}'
        })
        .addRoute('artistGetSimilar', {
            url: 'artists/{id}/related-artists',
            done: function(response) {
                return response.artists;
            }
        })
        .addRoute('artistGetAlbums', {
            url: 'artists/{id}/albums',
            params: {
                album_type: 'album',
                market: 'ES',
                limit: 50
            },
            done: function(response) {
                return response.items;
            }
        })
        .addRoute('artistGetTopTracks', {
            url: 'artists/{id}/top-tracks',
            params: {
                country: 'ES'
            },
            done: function(response) {
                return response.tracks;
            }
        })
        //.addRoute('albumSearch', {
        //    params: {
        //        method: 'album.search',
        //        limit: 5
        //    },
        //    done: function(response) {
        //        return response.results.albummatches.album;
        //    }
        //})
        .addRoute('albumGetInfo', {
            url: 'albums/{id}'
        })
        .addRoute('albumGetTracks', {
            url: 'albums/{id}/tracks',
            done: function(response) {
                return response.items;
            }
        })
        //.addRoute('trackSearch', {
        //    params: {
        //        method: 'track.search',
        //        limit: 5
        //    },
        //    done: function(response) {
        //        return response.results.trackmatches.track;
        //    }
        //})
        .addRoute('trackGetInfo', {
            url: 'tracks/{id}'
        })
        //.addRoute('trackGetSimilar', {
        //    params: {
        //        method: 'track.getSimilar',
        //        autocorrect: 1,
        //        limit: 10
        //    },
        //    done: function(response) {
        //        return response.similartracks.track;
        //    }
        //})
        //.addRoute('tagSearch', {
        //    params: {
        //        method: 'tag.search',
        //        limit: 5
        //    }
        //})
        //.addRoute('tagGetSimilar', {
        //    params: {
        //        method: 'tag.getSimilar',
        //        limit: 10
        //    }
        //})
    ;

    function _catchError(responce) {
        if (responce.hasOwnProperty('error')) {
            throw new Error('Spotify API error (' + responce['error'] + '): ' + responce['message']);
        }
    }

    return spotify;
});