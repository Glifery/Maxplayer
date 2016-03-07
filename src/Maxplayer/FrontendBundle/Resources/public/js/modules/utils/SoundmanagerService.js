define([
    'Utils/CheckType',
    'Utils/Debug',
    'soundmanager',
], function(
    checkType,
    debug,
    soundmanager
){
    var SoundmanagerServiceClass = SoundmanagerService,
        inited = null
    ;

    SoundmanagerServiceClass.prototype.init = _init;

    function SoundmanagerService() {};

    function _init(success, error, defaultOptions) {
        if (!inited) {
            inited = soundManager.setup({
                url: 'https://cdnjs.cloudflare.com/ajax/libs/soundmanager2/2.97a.20150601/swf/soundmanager2.swf',
                flashVersion: 9,
                debugMode: false,
                debugFlash: false,
                idPrefix: 'sound',
                onready: success,
                ontimeout: error,
                defaultOptions: defaultOptions
            });
        }

        return inited;
    }

    return new SoundmanagerServiceClass();
});