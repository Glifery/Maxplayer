//http://maxplayer.my/app_dev.php/test/module/Test-EventChain

define([
    'App',
    'Utils/ModelEventService',
    'Player/Player',
    'Domain/Track',
    'Domain/Sound',
], function (
    App,
    ModelEventService,
    Player,
    Track,
    Sound
    ) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    var player1 = new Player({name: 'player1'});
    var track1 = new Track({name: 'track1'});
    var track2 = new Track({name: 'track2'});
    var sound1 = new Sound({name: 'sound1'});
    var sound2 = new Sound({name: 'sound2'});

    console.log('CREATE', player1, track1, sound1);
    //ModelEventService.on(player1, 'currentTrack.sound', 'change:loadPosition', fnn, player1);
    player1.chainOn('currentTrack.sound', 'change:loadPosition', fnn, player1);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ player0 -> currentTrack0 -> sound0 +++++++++++++++++++++++++++++++++');

    sound0 = new Sound();
    player0 = new Player({name: 'player0', currentTrack: new Track({sound: sound0})});
    //console.log('GGGGGGG', player0.get('currentTrack'));
    sound0.set('loadPosition', 123);
    //ModelEventService.on(player0, 'currentTrack.sound', 'change:loadPosition', fnn, player1);
    player0.chainOn('currentTrack.sound', 'change:loadPosition', fnn, player1);
    sound0.set('loadPosition', 321);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ player1 -> currentTrack1 +++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', track1);
    sound1.set('loadPosition', 10);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ currentTrack1 -> sound1 ++++++++++++++++++++++++++++++++++++++++++++');

    track1.set('sound', sound1);
    sound1.set('loadPosition', 20);
    sound2.set('loadPosition', 20);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ currentTrack1 -> sound2 ++++++++++++++++++++++++++++++++++++++++++++');

    track1.set('sound', sound2);
    sound1.set('loadPosition', 21);
    sound2.set('loadPosition', 22);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ currentTrack2 -> sound1 ++++ player1 -> currentTrack2 ++++++++++++++');

    track2.set('sound', sound1);
    player1.set('currentTrack', track2);
    sound1.set('loadPosition', 31);
    sound2.set('loadPosition', 32);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ currentTrack1 -> sound1 ++++++++++++++++++++++++++++++++++++++++++++');

    track1.set('sound', sound1);
    sound1.set('loadPosition', 331);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ player1 -> currentTrack1 +++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', track1);
    sound1.set('loadPosition', 3331);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ player1 -> null ++++++++++++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', null);
    sound1.set('loadPosition', 41);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ player1 -> currentTrack2 +++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', track2);
    sound1.set('loadPosition', 441);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('++++ currentTrack2 -> {} ++++++++++++++++++++++++++++++++++++++++++++++++');

    track2.set('sound', {});
    sound1.set('loadPosition', 51);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    console.log('\\\\\\\\\\\\\\\\\\\\', player1);
    console.log('\\\\\\\\\\\\\\\\\\\\', track1);
    console.log('\\\\\\\\\\\\\\\\\\\\', sound1);

    function fnn(model, attribute) {
        console.log('!!!!!!!! SUCCESS', attribute);
        //console.log('!!!!!!!! FINAL', model, attribute, this);
    }
});
