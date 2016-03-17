//http://maxplayer.my/app_dev.php/test/module/Test-Playset

define([
    'App',
    'Guess/Guesser',
    'jquery',
    'Utils/FlowPromise',
    'Pool/SoundPoolService',
    'Player/Playset',
    'Player/Playlist',
    'Player/Player',
    'Player/SoundStream',
    'Utils/ModelEventService'
], function (
    App,
    Guesser,
    $,
    FlowPromise,
    SoundPoolService,
    Playset,
    Playlist,
    Player,
    SoundStream,
    ModelEventService
) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var guesser = new Guesser;
    var playset = new Playset;
    var playlist = new Playlist({playset: playset});
    var soundStream = new SoundStream;
    var player = new Player({playlist: playlist, soundStream: soundStream});

    $(function() {
        $('#container').append('<input type="text" class="js-input" value="">');
        $('#container').append('<p class="js-player"></p>');
        $('#container').append('<button class="js-button-next">Next</button>');
        $('#container').append('<div class="row"><ul class="col-md-6 js-playset"></ul><ul class="col-md-6 js-playlist"></ul></div>');

        playset.getCollection().on('update', function() {
            $('.js-playset').html('');

            playset.getCollection().each(function(element) {
                var track = element.get('domain');

                $('.js-playset').append('<li>'+track.get('name')+'</li>');
            });
        });

        playlist.on('update:prevCollection change:current update:nextCollection', function(collection, track) {
            $('.js-playlist').html('');

            playlist.get('prevCollection').each(function(element) {
                var track = element.get('domain');

                $('.js-playlist').append('<li style="color: red;">'+track.get('name')+'</li>');
            });

            $('.js-playlist').append('<li style="color: green;">---------------------</li>');
            if (playlist.get('current')) {
                $('.js-playlist').append('<li style="color: green;">'+playlist.get('current').get('name')+'</li>');
            }
            $('.js-playlist').append('<li style="color: green;">---------------------</li>');

            playlist.get('nextCollection').each(function(element) {
                var track = element.get('domain');

                $('.js-playlist').append('<li style="color: blue;">'+track.get('name')+'</li>');
            });
        });

        player.chainOn('currentTrack.sound', 'change', function(sound) {
            //console.log('change!!', sound);
            $('.js-player').html(sound.get('title') + ': (' + sound.get('loadPosition') + ') ' + sound.get('playPosition') + ' sec');
        });

        //player.on('update:currentTrack', function(currentTrack) {
        //    console.log('cT', currentTrack);
        //});

        guesser.on('change:track', function() {
            var loadedSongsAmount = 3;

            this.get('track').each(function(element) {
                var track = element.get('domain');

                if (loadedSongsAmount-- <= 0) {
                    return;
                }

                playset.add(track);
            });

            //playlist.gotoNextTrack()
            //    .then(function(next) {
            //        console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist.get('prevCollection').size(), playlist.get('nextCollection').size())
            //
            //        //playlist.loadNextTrack();
            //        //return playlist.gotoNextTrack();
            //    })
            //    //.then(function(next) {
            //    //    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist.get('prevCollection').size(), playlist.get('nextCollection').size())
            //    //
            //    //    return playlist.gotoNextTrack();
            //    //})
            //    //.then(function(next) {
            //    //    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist.get('prevCollection').size(), playlist.get('nextCollection').size())
            //    //
            //    //    playlist.loadNextTrack();
            //    //})
            //;
        });

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });

        $('.js-button-next').on('click', function() {
            playlist.gotoNextTrack()
                .then(function(next) {
                    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', playlist.get('prevCollection').size(), playlist.get('nextCollection').size())

                    return playlist.loadNextTrack();
                })
            ;
        })
    });
});