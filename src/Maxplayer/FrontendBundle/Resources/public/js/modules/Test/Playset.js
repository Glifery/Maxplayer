//http://maxplayer.my/app_dev.php/test/module/Test-Playset

define([
    'App',
    'Guess/Guesser',
    'jquery',
    'Pool/SoundPoolService',
    'Player/Playset'
], function (
    App,
    Guesser,
    $,
    SoundPoolService,
    Playset
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var guesser = new Guesser;
    var playset = new Playset;

    $(function() {
        $('body').append('<input type="text" class="js-input" value="">');

        guesser.on('change:track', function() {
            var track = this.get('track').getDomains()[0];

            console.log('..add to playset', playset, track);
            playset
                .add(track)
                .add(track)
                .add(track)
            ;

            var next = playset.getNext();

            console.log('..next', next);
        });

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            guesser.set('query', query);
        });
    });
});