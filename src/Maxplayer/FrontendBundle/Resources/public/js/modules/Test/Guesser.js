//http://maxplayer.my/app_dev.php/test/module/Test-Guesser

define([
    'App',
    'Guess/Guesser',
    'jquery',
], function (
    App,
    Guesser,
    $
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('This is Guesser');

    var guesser = new Guesser;

    $(function() {
        $('#container').append('<input type="text" class="js-input" value="">');

        guesser.on('change:artist', function() {console.log('ARTIST!!', this.get('artist').getDomains()[0].get('name'))});
        guesser.on('change:album', function() {console.log('ALBUM!!', this.get('album').getDomains()[0].get('name'))});
        guesser.on('change:track', function() {console.log('TRACK!!', this.get('track').getDomains()[0])});
        guesser.on('change:tag', function() {console.log('TAG!!', this.get('tag').getDomains()[0].get('name'))});
        guesser.on('change:all', function(arg) {console.log('ALL!!!!!!!!!', arg)});

        $('.js-input').on('keyup', function() {
            var query = $(this).val();

            console.log('keypress', query);

            guesser.set('query', query);
        });
    });
});