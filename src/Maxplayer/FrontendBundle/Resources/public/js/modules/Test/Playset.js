//http://maxplayer.my/app_dev.php/test/module/Test-Playset

define([
    'App',
    'Guess/Guesser',
    'jquery',
    'Pool/SoundPoolService',
    'Player/Playset',
    'Player/Playlist'
], function (
    App,
    Guesser,
    $,
    SoundPoolService,
    Playset,
    Playlist
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', Playlist);

    var guesser = new Guesser;
    var playset = new Playset;
    var playlist = new Playlist;
    playlist.setPlayset(playset);

    $(function() {
        $('body').append('<input type="text" class="js-input" value="">');

        guesser.on('change:track', function() {
            var track = this.get('track').getDomains()[0];

            console.log('..add to playset', playset, track);
            playset
                .add(this.get('track').getDomains()[0])
                .add(this.get('track').getDomains()[0])
                .add(this.get('track').getDomains()[1])
                .add(this.get('track').getDomains()[2])
                .add(this.get('track').getDomains()[3])
            ;

            playlist
                .loadNextTrack(function(next) {
                    console.log('..!!! loadNextTrack', playlist);
                })
                .loadNextTrack(function(next) {
                    console.log('..!!! loadNextTrack', playlist);
                })
            ;
        });

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });
    });
});