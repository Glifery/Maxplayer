define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Pool/SoundPoolService'
], function(
    checkType,
    debug,
    Backbone,
    SoundPoolService
    ){
    var Player = Backbone.Model.extend({
        defaults: {
            playlist: null,
            soundStream: null,
            currentTrack: null,
            volume: 50
        },

        initialize: function() {
            this.chainOn('playlist', 'change:current', function(playlist, track) {
                this.play(track);
            }, this)
        },

        play: function(track) {
            var _this = this;

            this.get('soundStream').stopCurrent();
            this.set('currentTrack', track);

            return SoundPoolService
                .fillSound(track)
                .then(function(sound) {
                    _this.get('soundStream').playInStream(sound);
                })
            ;
        },

        setVolume: function(volume) {
            this.get('soundStream').setVolume(volume)
        }
    });

    return Player;
});