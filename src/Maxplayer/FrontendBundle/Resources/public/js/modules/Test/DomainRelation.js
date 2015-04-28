//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'Pool/DomainBinderService',
    'Domain/Artist',
    'Pool/ArtistPoolService'
], function (
    DomainBinderService,
    Artist,
    ArtistPoolService
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation');

//    ArtistPoolService
//        .search('ABBA')
//        .then(function(collection) {
//            console.log('search!!', collection);
//        })
//        .catch(function(error) {
//            console.log('CATCH:', error);
//        })
//    ;

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    var artist = new Artist();
    artist.set('name', 'ABBA');

    artist
        .similar()
        .then(function(collection) {
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].similar();
        })
        .then(function(collection) {
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].similar();
        })
        .then(function(collection) {
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].similar();
        })
    ;

//    ArtistPoolService.getSimilar(artist).then(
//        function(artists) {
//            console.log('artists', artists);
//        },
//        function(errorMessage) {
//            console.error(errorMessage.message);
//        }
//    );
});