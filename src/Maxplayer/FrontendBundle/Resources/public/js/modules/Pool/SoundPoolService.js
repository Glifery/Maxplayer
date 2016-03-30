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

    SoundPoolServiceClass.prototype.fillSound = _fillSound;

    function SoundPoolService() {}

    function _fillSound(track) {
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
            VkResourceService
                .trackSound(request)
                .then(function(response) {
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
