define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone',
    'Domain/Collection'
], function(
    checkType,
    debug,
    Backbone,
    Collection
){
    var PlaylistClass = Playlist;
    PlaylistClass.prototype.gotoNextTrack = _gotoNextTrack;
    PlaylistClass.prototype.setPlayset = _setPlayset;

    function Playlist() {
        this._prevCollection = new Collection();
        this._nextCollection = new Collection();
        this._playset = null;
    }

    function _setPlayset(playset) {
        this._playset = playset;

        return this;
    }

    function _gotoNextTrack() {
        var _this = this,
            loadedTrack = _shiftAndGetNext(this._prevCollection, this._nextCollection)
        ;

        //If there is element in nextCollection
        if (loadedTrack) {
            return Promise.resolve(loadedTrack);
        }

        //If nextCollection is empty
        return _getNextFromPlayset(this)
            .then(function() {
                return _this.gotoNextTrack();
            })
        ;
    }

    function _getNextFromPlayset(playlist) {
        return playlist._playset
            .getNextTrack()
            .then(function(nextTrack) {
                playlist._nextCollection.addDomain(nextTrack);
            })
        ;
    }

    function _shiftAndGetNext(prevCollection, nextCollection) {
        var nextTrack = nextCollection.shift();

        if (!nextTrack) {
            return null;
        }

        prevCollection.addDomain(nextTrack.get('domain'));

        return nextTrack.get('domain');
    }

    return PlaylistClass;
});