define([
    'Utils/CheckType'
], function (
    CheckType
    ) {
    var TrackClass = Track;

    TrackClass.prototype.break = _break;
    TrackClass.prototype.check = _check;
    TrackClass.prototype.then = _then;

    function Track(node) {
        this._breaked = false;
        this._promise = Promise.resolve();
        this._iterator = null;
    }

    function _break() {
        this._breaked = true;
    }

    function _check(promise) {
        var _this = this;

        return function(result) {
            if (_this._breaked) {
                throw new Error('track have bean breaked');
            }

            return promise(result);
        }
    }

    function _then(resolveFn, rejectFn) {
        this._promise = this._promise.then(this.check(resolveFn), this.check(rejectFn));

        return this;
    }

    return TrackClass;
});
