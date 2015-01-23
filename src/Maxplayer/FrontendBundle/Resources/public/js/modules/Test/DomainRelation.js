//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'Domain/Artist',
    'Pool/ArtistPoolService'
], function (
    Artist,
    ArtistPoolService
    ) {
    var artist = new Artist;
    artist.set('name', 'ABBA');

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation', ArtistPoolService);
    ArtistPoolService.getSimilar(artist).then(
        function(artists) {
            console.log('artists', artists);
        },
        function(errorMessage) {
            console.error(errorMessage.message);
        }
    );
});