define([
    'backbone',
    'Utils/PromiseChain'
], function(
    Backbone,
    PromiseChain
    ){
    var Player = Backbone.Model.extend({
        defaults: {
            playlist: null,
            soundStream: null,
            currentTrack: null,
            volume: 50
        },

        play: function(track) {
            var _this = this;

            this.get('soundStream').stopCurrent();
            this.set('currentTrack', track);

            return new PromiseChain('Player.play')
                .then(function() {
                    console.log('....Player.fillSound');
                    return track.getSound();
                })
                .then(function(sound) {
                    console.log('....Player.playInStream');
                    return _this.get('soundStream').playInStream(sound);
                })
            ;
        },

        playNext: function() {
            var _this = this;

            return new PromiseChain('Playlist.playNext')
                .then(function() {
                    console.log('..Player.gotoNextTrack');
                    return _this.get('playlist').gotoNextTrack();
                })
                .then(function(track) {
                    console.log('..Player.play');
                    return _this.play(track);
                })
                .then(function(track) {
                    return _this.get('playlist').loadNextTrack();
                })
            ;
        },

        setVolume: function(volume) {
            this.get('soundStream').setVolume(volume)
        }
    });

    return Player;
});