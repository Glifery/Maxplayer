define([
    'Utils/CheckType',
    'Utils/Debug',
    'soundmanager',
], function(
    checkType,
    debug,
    soundmanager
){
    soundManager.setup({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/soundmanager2/2.97a.20150601/swf/soundmanager2.swf',
        flashVersion: 9, // optional: shiny features (default = 8)
        // optional: ignore Flash where possible, use 100% HTML5 mode
        // preferFlash: false,
        onready: function() {
            console.log('SOUND MANAGER READY');
        }
    });

    return soundManager;
});