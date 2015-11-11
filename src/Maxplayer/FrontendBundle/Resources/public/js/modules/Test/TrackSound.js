//http://maxplayer.my/app_dev.php/test/module/Test-TrackSound

define([
    'App',
    'Guess/Guesser',
    'jquery',
    'Pool/SoundPoolService',
    'Utils/Soundmanager'
], function (
    App,
    Guesser,
    $,
    SoundPoolService,
    Soundmanager
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is Guesser', Soundmanager);

    var guesser = new Guesser;

    $(function() {
        $('body').append('<input type="text" class="js-input" value="">');

        guesser.on('change:track', function() {
            var track = this.get('track').getDomains()[0];

            SoundPoolService
                .fillSound(track)
                .then(function() {
                    console.log('FILLED  TRACK!! data', track);

                    Soundmanager.createSound({
                        id: 'mySound',
                        url: track.get('sound'),
                        autoLoad: true,
                        autoPlay: true,
                        onload: function() {
                            alert('The sound '+this.id+' loaded!');
                        },
                        volume: 50
                    });
                })
            ;
        });

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });
    });
});