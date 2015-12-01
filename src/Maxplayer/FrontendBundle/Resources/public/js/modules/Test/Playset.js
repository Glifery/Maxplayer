//http://maxplayer.my/app_dev.php/test/module/Test-Playset

define([
    'App',
    'Guess/Guesser',
    'jquery',
    'Utils/FlowPromise',
    'Pool/SoundPoolService',
    'Player/Playset',
    'Player/Playlist'
], function (
    App,
    Guesser,
    $,
    FlowPromise,
    SoundPoolService,
    Playset,
    Playlist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var guesser = new Guesser;
    var playset = new Playset;
    var playlist = new Playlist;
    playlist.setPlayset(playset);

    $(function() {
        $('body').append('<input type="text" class="js-input" value="">');
        $('body').append('<ul class="js-playset">');

        guesser.on('change:track', function() {
            var track = this.get('track').getDomains()[0];

            playset
                .add(this.get('track').getDomains()[0])
                .add(this.get('track').getDomains()[1])
                .add(this.get('track').getDomains()[2])
                .add(this.get('track').getDomains()[3])
                .add(this.get('track').getDomains()[4])
            ;
            $('.js-playset')
                .append('<li>'+this.get('track').getDomains()[0].get('name')+'</li>')
                .append('<li>'+this.get('track').getDomains()[1].get('name')+'</li>')
                .append('<li>'+this.get('track').getDomains()[2].get('name')+'</li>')
                .append('<li>'+this.get('track').getDomains()[3].get('name')+'</li>')
                .append('<li>'+this.get('track').getDomains()[4].get('name')+'</li>')
            ;

            playlist.gotoNextTrack()
                .then(function(next) {
                    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist._prevCollection.size(), playlist._nextCollection.size())

                    return playlist.gotoNextTrack();
                })
                .then(function(next) {
                    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist._prevCollection.size(), playlist._nextCollection.size())

                    return playlist.gotoNextTrack();
                })
                .then(function(next) {
                    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist._prevCollection.size(), playlist._nextCollection.size())

                    return playlist.gotoNextTrack();
                })
            ;
        });

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });
    });
});