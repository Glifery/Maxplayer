//http://maxplayer.my/app_dev.php/test/module/Test-SpotifyTest

define([
    'App',
    'jquery',
    'spotify',
    'Api/SpotifyResourceService'
], function (
    App,
    $,
    spotify,
    SpotifyResourceService
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var spotifyApi = new SpotifyWebApi();
    //spotifyApi.setAccessToken('b0be3e17373f45c28944c75ff0b04090');

    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
        if (err) console.error(err);
        else console.log('Artist albums', data);
    });

    // get Elvis' albums, using Promises through Promise, Q or when
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
        .then(function(data) {
            console.log('Artist albums', data);
        }, function(err) {
            console.error(err);
        });

    console.log('spotify', spotify, spotifyApi);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    console.log('SpotifyResourceService', SpotifyResourceService);
    SpotifyResourceService
        .search({'q': 'ABBA'})
        .then(function(response) {
            console.log('SEARCH!', response.artists.items[0].id);

            return SpotifyResourceService.artistGetSimilar({'id': response.artists.items[0].id});
        })
        .then(function(response) {
            console.log('SIMILAR', response);
        })
    ;
});