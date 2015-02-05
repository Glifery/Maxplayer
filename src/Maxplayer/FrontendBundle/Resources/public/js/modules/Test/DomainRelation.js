//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'Pool/DomainBinderService',
    'Domain/Artist'
], function (
    DomainBinderService,
    Artist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation');

    var artist = new Artist();
    artist.set('name', 'ABBA');

    artist.similar().then(function(collection) {
        var domains = collection.getDomains();

        console.log('DONE!!!', domains);
    });

//    ArtistPoolService.getSimilar(artist).then(
//        function(artists) {
//            console.log('artists', artists);
//        },
//        function(errorMessage) {
//            console.error(errorMessage.message);
//        }
//    );
});