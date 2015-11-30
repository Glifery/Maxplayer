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
    PlaylistClass.prototype.loadNextTrack = _loadNextTrack;
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

    function _loadNextTrack(callback, scope) {
        var loadedTrack = _moveToNext(this._prevCollection, this._nextCollection);

        //If there is element in nextCollection
        if (loadedTrack) {
            callback.call(scope, loadedTrack);

            return this;
        }

        //If nextCollection is empty
        this._playset.getNextTrack(function(nextTrack) {
            this._nextCollection.push(nextTrack);
            _loadNextTrack.call(this, callback, scope);
        }, this);

        return this;
    }

    function _moveToNext(prevCollection, nextCollection) {
        var nextTrack = nextCollection.shift();

        if (!nextTrack) {
            return null;
        }

        prevCollection.push(nextTrack);

        return nextTrack;
    }

    return PlaylistClass;
});