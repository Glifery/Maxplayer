//http://maxplayer.my/app_dev.php/test/module/Test-DemoPlayer

define([
    'jquery',
    'underscore',
    'App',
    'Guess/Guesser',
    'Player/PlayerKitService',
    'Pool/ArtistPoolService',
    'text!template/demo/DemoPlayer.html'
], function (
    $,
    _,
    App,
    Guesser,
    PlayerKitService,
    ArtistPoolService,
    template
) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var guesser = new Guesser;

    $(function() {
        $('#container').append(_.template(template));

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });

        guesser.on('change:all', function() {
            $('.js-guesser-artist, .js-guesser-album, .js-guesser-track').html('');

            guesser.get('artist').each(function(element) {
                var domain = element.get('domain');

                $('.js-guesser-artist').append('<li><a class="js-playset-add-artist" href="javascript:void(0);" data-id="' + domain.get('id') + '">' + domain.get('name') + '</a></li>');
            });
            guesser.get('album').each(function(element) {
                var domain = element.get('domain');

                $('.js-guesser-album').append('<li><a class="js-playset-add-album" href="javascript:void(0);" data-id="' + domain.get('id') + '">' + domain.get('name') + '</a></li>');
            });
            guesser.get('track').each(function(element) {
                var domain = element.get('domain');

                $('.js-guesser-track').append('<li><a class="js-playset-add-track" href="javascript:void(0);" data-id="' + domain.get('id') + '">' + domain.get('name') + ' (' + domain.get('artist') + ' "' + domain.get('album') + '")</a></li>');
            });
        });

        $(document).on('click', '.js-playset-add-artist', function() {
            var id = $(this).attr('data-id'),
                artist = ArtistPoolService.getById(id, 'artist')
            ;

            PlayerKitService.playset.set(artist);
            PlayerKitService.playlist.gotoNextTrack();
        });

        $(document).on('click', '.js-playset-add-album', function() {
            var id = $(this).attr('data-id'),
                album = ArtistPoolService.getById(id, 'album')
            ;

            PlayerKitService.playset.set(album);
            PlayerKitService.playlist.gotoNextTrack();
        });

        $(document).on('click', '.js-playset-add-track', function() {
            var id = $(this).attr('data-id'),
                track = ArtistPoolService.getById(id, 'track')
            ;

            PlayerKitService.playset.set(track);
            PlayerKitService.playlist.gotoNextTrack();
        });

        PlayerKitService.playset.getCollection().on('update', function() {
            $('.js-playset').html('');

            PlayerKitService.playset.getCollection().each(function(element) {
                var track = element.get('domain');

                $('.js-playset').append('<li><a class="js-playlist-add" href="javascript:void(0);" data-id="' + track.get('id') + '">' + track.get('name') + ' (' + track.get('artist') + ' "' + track.get('album') + '")</a></li>');
            });
        });



        PlayerKitService.playlist.on('update:prevCollection change:current update:nextCollection', function(collection, track) {
            $('.js-playlist').html('');

            PlayerKitService.playlist.get('prevCollection').each(function(element) {
                var track = element.get('domain');

                $('.js-playlist').append('<li style="color: red;">'+track.get('name')+'</li>');
            });

            $('.js-playlist').append('<li style="color: green;">---------------------</li>');
            if (PlayerKitService.playlist.get('current')) {
                $('.js-playlist').append('<li style="color: green;">'+PlayerKitService.playlist.get('current').get('name')+'</li>');
            }
            $('.js-playlist').append('<li style="color: green;">---------------------</li>');

            PlayerKitService.playlist.get('nextCollection').each(function(element) {
                var track = element.get('domain');

                $('.js-playlist').append('<li style="color: blue;">'+track.get('name')+'</li>');
            });
        });

        PlayerKitService.player.chainOn('currentTrack.sound', 'change', function(sound) {
            //console.log('change!!', sound);
            $('.js-player').html(sound.get('title') + ': (' + sound.get('loadPosition') + ') ' + sound.get('playPosition') + ' sec');
        });

        $('.js-button-next').on('click', function() {
            PlayerKitService.playlist.gotoNextTrack()
                .then(function(next) {
                    console.log('..gotoNextTrack:', next.get('name'), '   prev/next:', PlayerKitService.playlist.get('prevCollection').size(), PlayerKitService.playlist.get('nextCollection').size())

                    return PlayerKitService.playlist.loadNextTrack();
                })
            ;
        })
    });
});