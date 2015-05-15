//http://maxplayer.my/app_dev.php/test/module/Test-Guesser

define([
    'App',
    'Guess/Guesser',
    'jquery'
], function (
    App,
    Guesser,
    $
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is Guesser');

    var guesser = new Guesser;

    $(function() {
        $('body').append('<input type="text" class="js-input" value="">');

        guesser.on('change:artist', function() {console.log('change!!', this.get('artist').getDomains()[0].get('name'))});

        $('.js-input').on('keypress', function() {
            console.log('keypress');

            var query = $(this).val();

            guesser.set('query', query);
        });
    });
});