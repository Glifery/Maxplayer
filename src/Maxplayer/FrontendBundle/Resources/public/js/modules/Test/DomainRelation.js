//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'App',
    'Domain/Artist'
], function (
    App,
    Artist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation 2');

    var artist = new Artist();
    artist.set('name', 'Rhapsody');

    artist
        .getSimilar()
        .then(function(collection) {
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].getTopTracks();
        })
        .then(function(collection) {
            console.log('tracks collection', collection);
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].getArtist();
        })
        .then(function(anotherArtist) {
            console.log('anotherArtist', anotherArtist);

            console.log('DONE!!!', anotherArtist.get('name'));

            return anotherArtist.getTopTracks();
        })
        .then(function(collection) {
            console.log('collection or artist', collection);
            var domains = collection.getDomains();

            console.log('DONE!!!', domains[3].get('name'));

            return domains[3].getSimilar();
        })
    ;
});