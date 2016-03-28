//http://maxplayer.my/app_dev.php/test/module/Test-DomainRelation

define([
    'App',
    'Utils/PromiseChain',
    'Domain/Artist'
], function (
    App,
    PromiseChain,
    Artist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is DomainRelation 2');

    var artist = new Artist();
    artist.set('name', 'ABBA');
    artist.set('id', '0LcJLqbBmaGUft1e9Mm8HV');

    new PromiseChain()
        .then(function() {
            console.log('1. DONE!!!', artist.get('name'));

            return artist.getSimilar();
        })
        .then(function(collection) {
            var domains = collection.getDomains();

            console.log('2. DONE!!!', domains[3].get('name'), domains);

            return domains[3].getTopTracks();
        })
        .then(function(collection) {
            console.log('tracks collection', collection);
            var domains = collection.getDomains();

            console.log('3. DONE!!!', domains[3].get('name'));

            return domains[3].getArtist();
        })
        .then(function(anotherArtist) {
            console.log('anotherArtist', anotherArtist);

            console.log('4. DONE!!!', anotherArtist.get('name'));

            return anotherArtist.getTopTracks();
        })
        .then(function(collection) {
            console.log('tracks collection', collection);
            var domains = collection.getDomains();

            console.log('5. DONE!!!', domains[3].get('name'), domains);

            return domains[3].getAlbum();
        })

        .then(function(anotherAlbum) {
            console.log('anotherAlbum or artist', anotherAlbum);

            console.log('6. DONE!!!', anotherAlbum.get('name'));

            //return domains[3].getAlbum();
        })
    ;
});