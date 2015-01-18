define([
    'Utils/CheckType'
], function (
    CheckType
    ) {
    var TrackClass = Track;

    TrackClass.prototype.break = _break;
    TrackClass.prototype.check = _check;
//    TrackClass.prototype.then = _then;

    function Track(node) {
        this.breaked = false;
//        this.prototype = Promise.resolve();
        this.promise = Promise.resolve();
    }

    function _break() {
        this.breaked = true;
    }

    function _check(promise) {
        var _this = this;

        return function(result) {
            if (_this.breaked) {
                throw new Error('track have bean breaked');
            }

            return promise(result);
        }
    }

//    function _then(resolveFn, rejectFn) {
//        var _this = this,
//            resolveFnWrap = undefined,
//            rejectFnWrap = undefined
//        ;
//
//        if (typeof resolveFn === 'function') {
//            resolveFnWrap = function(result) {
//                console.log('..resolve', _this);
//                if (!_this._break) {
//                    console.log('...yes');
//                    resolveFn(result);
//                }
//            }
//        }
//        if (typeof rejectFn === 'function') {
//            rejectFnWrap = function(result) {
//                if (!_this._break) {
//                    rejectFn(result);
//                }
//            }
//        }
//
//        return this.prototype.then(resolveFnWrap, rejectFnWrap);
//    }

    return TrackClass;
});
