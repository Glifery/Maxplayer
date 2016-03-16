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

    _debug(player1);
    player1.chainOn('currentTrack.sound', 'change:loadPosition', fnn, player1);


    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('1+++ player0 -> currentTrack0 -> sound0 ++++++++++++++++++++++++++++++321');

    sound0 = new Sound({name: 'sound0'});
    player0 = new Player({name: 'player0', currentTrack: new Track({name: 'track0', sound: sound0})});
    _debug(player0);
    sound0.set('loadPosition', 123);
    player0.chainOn('currentTrack.sound', 'change:loadPosition', fnn, player1);
    sound0.set('loadPosition', 321);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('2+++ player1 -> currentTrack1 +++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', track1);
    sound1.set('loadPosition', 10);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('3+++ currentTrack1 -> sound1 ++++++++++++++++++++++++++++++++++++++++++20');

    track1.set('sound', sound1);
    sound1.set('loadPosition', 20);
    sound2.set('loadPosition', 20);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('4+++ currentTrack1 -> sound2 ++++++++++++++++++++++++++++++++++++++++++22');

    track1.set('sound', sound2);
    sound1.set('loadPosition', 21);
    sound2.set('loadPosition', 22);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('5+++ currentTrack2 -> sound1 ++++ player1 -> currentTrack2 ++++++++++++31');

    track2.set('sound', sound1);
    player1.set('currentTrack', track2);
    sound1.set('loadPosition', 31);
    sound2.set('loadPosition', 32);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('6+++ currentTrack1 -> sound1 +++++++++++++++++++++++++++++++++++++++++331');

    track1.set('sound', sound1);
    sound1.set('loadPosition', 331);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('7+++ player1 -> currentTrack1 +++++++++++++++++++++++++++++++++++++++3331');

    player1.set('currentTrack', track1);
    sound1.set('loadPosition', 3331);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('8+++ player1 -> null ++++++++++++++++++++++++++++++++++++++++++++++++++++');

    player1.set('currentTrack', null);
    sound1.set('loadPosition', 41);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('9+++ player1 -> currentTrack2 ++++++++++++++++++++++++++++++++++++++++441');

    player1.set('currentTrack', track2);
    sound1.set('loadPosition', 441);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('10++ currentTrack2 -> {} ++++++++++++++++++++++++++++++++++++++++++++++++');

    track2.set('sound', {});
    sound1.set('loadPosition', 51);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('11++ currentTrack2 -> sound1 ++++ currentTrack1 -> {} +++++++++++++++++61');

    track2.set('sound', sound1);
    track1.set('sound', {});
    sound1.set('loadPosition', 61);

    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    console.log('\\\\\\\\\\\\\\\\\\\\', player1);
    console.log('\\\\\\\\\\\\\\\\\\\\', track1);
    console.log('\\\\\\\\\\\\\\\\\\\\', sound1);

    function fnn(model, attribute) {
        console.log('!!!!!!!! SUCCESS', attribute, this.get('name'));
    }

    function _debug(player) {
        player.on('chain:traverse:on', function(data) {
            console.warn(
                data.event,
                data.model.get('name'),
                '-->',
                data.attribute,
                '{',
                data.model.get(data.attribute) instanceof Backbone.Model ? data.model.get(data.attribute).get('name') : typeof data.model.get(data.attribute)
            );
        });
        player.on('chain:traverse:off', function(data) {
            console.info(
                data.event,
                data.model.get('name'),
                '-->',
                data.attribute,
                '{',
                data.model.get(data.attribute) instanceof Backbone.Model ? data.model.get(data.attribute).get('name') : typeof data.model.get(data.attribute)
            );
        });
        player.on('chain:traverse:fire', function(data) {
            console.error(
                data.event,
                data.model.get('name'),
                '-->',
                data.value instanceof Backbone.Model ? data.value.get('name') : typeof data.value,
                '{',
                data.previous instanceof Backbone.Model ? data.previous.get('name') : typeof data.previous
            );
        });
        player.on('chain:end_event:on', function(data) {
            console.warn(data.event, data.model.get('name'), '-->', data.context.event, '[', data.context.context.get('name'));
        });
        player.on('chain:end_event:off', function(data) {
            console.info(data.event, data.model.get('name'), '-->', data.context.event, '[', data.context.context.get('name'));
        });
        player.on('chain:end_event:fire', function(data) {
            console.error(data.event, data.data[0].get('name'), '(', data.context.event, '[', data.context.context.get('name'));
        });
        player.on('chain', function(data) {
            console.log('  ', data);
        });
    }
});
