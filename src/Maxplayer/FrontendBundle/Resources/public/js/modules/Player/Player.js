define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function(
    checkType,
    debug,
    Backbone
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
        }
    });

    function changePlaylistListener(model, playlist) {
        var pleviousPlaylist = null;

        if (pleviousPlaylist = model.previous('playlist')) {
            pleviousPlaylist.off('change:current', changeCurrentListener);
        }

        playlist.on('change:current', changeCurrentListener)
    }

    function changeCurrentListener(model, current) {
        console.log('....play!!', current.get('name'));
    }

    return Player;
});