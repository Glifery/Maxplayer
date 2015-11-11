define([
    'Utils/CheckType',
    'Utils/Debug',
    'Api/VkResourceService'
], function (
    CheckType,
    Debug,
    VkResourceService
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
            }
        ;

        return new Promise(function(resolve, reject) {
            VkResourceService
                .trackSound(request)
                .then(function(responce) {
                        track.set('sound', responce.data.sound);

                        resolve(track);
                    },
                    function(responce) {
                        reject(responce);
                    }
                )
            ;
        });
    }

    return new SoundPoolServiceClass();
});
