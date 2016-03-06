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
            current: null,
            status: null,
            playlist: null,
            soundStream: null
        },

        initialize: function() {
            this.on('change:playlist', changePlaylistListener);

            if (this.get('playlist')) {
                changePlaylistListener(this, this.get('playlist'));
            }
        },

        play: function(track) {
            var _this = this;
            console.log('....load', track.get('name'));

            return SoundPoolService
                .fillSound(track)
                .then(function() {
                    return _this.get('soundStream').playInStream(track);
                })
            ;
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

    return Player;
});