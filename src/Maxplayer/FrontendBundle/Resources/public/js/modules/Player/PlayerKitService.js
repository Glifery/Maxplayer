define([
    'Player/Playset',
    'Player/Playlist',
    'Player/Player',
    'Player/SoundStream'
], function (
    Playset,
    Playlist,
    Player,
    SoundStream
) {
    var PlayerKitServiceClass = PlayerKitService;

    function PlayerKitService() {
        var playset = new Playset;
        var playlist = new Playlist({playset: playset});
        var soundStream = new SoundStream;
        var player = new Player({playlist: playlist, soundStream: soundStream});

        this.playset = playset;
        this.playlist = playlist;
        this.soundStream = soundStream;
        this.player = player;
    }

    return new PlayerKitServiceClass();
});
