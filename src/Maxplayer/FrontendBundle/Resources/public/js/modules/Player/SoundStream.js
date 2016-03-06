define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Utils/Soundmanager'
], function(
    checkType,
    debug,
    Backbone,
    Soundmanager
){
    var SoundStream = Backbone.Model.extend({
        defaults: {
            current: null,
            status: null,
            playlist: null,
            soundStream: null
        },

        playInStream: function(track) {
            console.log('....play', track.get('name'));

            Soundmanager.createSound({
                id: 'mySound',
                url: track.get('sound'),
                autoLoad: true,
                autoPlay: true,
                onload: function() {
                    //alert('The sound '+this.id+' loaded!');
                },
                volume: 50
            });
        }
    });

    return SoundStream;
});