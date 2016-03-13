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
            this.on('change:playlist', changePlaylistListener);

            if (this.get('playlist')) {
                changePlaylistListener(this, this.get('playlist'));
            }
        },

        play: function(track) {
            this.get('soundStream').stopCurrent();
            this.set('currentTrack', track);

            return SoundPoolService
                .fillSound(track)
                .then(playInStream(this))
            ;
        },

        setVolume: function(volume) {
            this.get('soundStream').setVolume(volume)
        }
    });

    function changePlaylistListener(player, playlist) {
        var pleviousPlaylist = null;

        if (pleviousPlaylist = player.previous('playlist')) {
            pleviousPlaylist.off('change:current', changeCurrentListener);
        }

        if (playlist) {
            playlist.on('change:current', changeCurrentListener, player)
        }
    }

    function changeCurrentListener(playlist, track) {
        this.play(track);
    }

    function playInStream(player) {
        return function(sound) {
            return player.get('soundStream').playInStream(sound);
        }
    }

    return Player;
});