define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Utils/SoundmanagerService'
], function(
    checkType,
    debug,
    Backbone,
    SoundmanagerService
){
    var SoundStream = Backbone.Model.extend({
        defaults: {
            currentSound: null,
            status: null
        },

        initialize: function() {
            var _this = this;

            SoundmanagerService = SoundmanagerService.init(function() {
                _this.set('status', true);
            }, function() {
                _this.set('status', false);
            })
        },

        stopCurrent: function() {
            var currentSound = this.get('currentSound');

            if (!currentSound) {
                return;
            }

            currentSound.get('stream')
                .stop()
                .destruct()
            ;

            currentSound.set({
                stream: null,
                loadStatus: false,
                loadPosition: 0,
                playStatus: false,
                playPosition: 0
            });

            this.set('currentSound', null);
        },

        playInStream: function(sound) {
            this.stopCurrent(this);

            var stream = SoundmanagerService.createSound({
                url: sound.get('url'),
                autoLoad: true,
                autoPlay: true,
                onload: function() {
                    //alert('The sound '+this.id+' loaded!');
                },
                volume: 50
            });

            sound.set({
                stream: stream,
                loadStatus: true,
                playStatus: true
            });
            this.set('currentSound', sound);
        }
    });

    return SoundStream;
});