//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'App',
    'Domain/Artist'
], function (
    App,
    Artist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation');

    var artist = new Artist();
    artist.set('name', 'Rhapsody');

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
});