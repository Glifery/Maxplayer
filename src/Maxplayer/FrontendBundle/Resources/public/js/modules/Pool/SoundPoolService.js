define([
    'Utils/CheckType',
    'Utils/Debug',
    'Api/VkResourceService',
    'Domain/Sound'
], function (
    CheckType,
    Debug,
    VkResourceService,
    Sound
) {
    var SoundPoolServiceClass = SoundPoolService;

    SoundPoolServiceClass.prototype.getSound = _getSound;

    function SoundPoolService() {}

    function _getSound(track) {
        var _this = this,
            request = {
                data: {
                    track: {
                        artist: track.get('artist'),
                        track: track.get('name')
                    }
                }
            },
            sound = track.get('sound')
        ;

        if (sound) {
            return Promise.resolve(sound);
        }

        return new Promise(function(resolve, reject) {
            console.log('......SoundPoolService.trackSound');
            VkResourceService
                .trackSound(request)
                .then(function(response) {
                    console.log('......SoundPoolService.set sound');
                        sound = new Sound(response);
                        track.set('sound', sound);

                        resolve(sound);
                    },
                    function(response) {
                        reject(response);
                    }
                )
            ;
        });
    }

    return new SoundPoolServiceClass();
});
