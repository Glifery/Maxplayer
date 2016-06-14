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
            status: null,
            currentSound: null
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

            if ((!currentSound) || (!currentSound.get('stream'))) {
                return;
            }

            currentSound.get('stream')
                .stop()
                .destruct()
            ;

            currentSound.set({
                stream: null,
                loadPosition: 0,
                playPosition: 0
            });

            this.set('currentSound', null);
        },

        playInStream: function(sound) {
            this.stopCurrent(this);

            if (!sound.get('url')) {
                console.log('ERROR: no sound URL found');

                return;
            }

            var stream = SoundmanagerService.createSound({
                url: sound.get('url'),
                autoLoad: true,
                autoPlay: true,
                whileloading: function(qq,ww,ee,rr) {
                    var loadPosition = this.bytesLoaded / this.bytesTotal;

                    sound.set('loadPosition', loadPosition);
                },
                whileplaying: function(qq,ww,ee,rr) {
                    var playPosition = Math.round(this.position / 1000);

                    sound.set('playPosition', playPosition);
                }
            });

            sound.set('stream', stream);

            this.set('currentSound', sound);
        },

        setVolume: function(volume) {
            SoundmanagerService.setVolume(volume);
        }
    });

    return SoundStream;
});