define([
    'Utils/CheckType'
], function (
    CheckType
    ) {
    var FlowPromiseClass = FlowPromise;

    FlowPromiseClass.prototype.break = _break;
    FlowPromiseClass.prototype.then = _then;
    FlowPromiseClass.prototype.catch = _catch;

    function FlowPromise(resolvedResult) {
        this._breaked = false;
        this._breakFnFired = false;
        this._promise = Promise.resolve(resolvedResult);
    }

    function _break() {
        this._breaked = true;

        return this;
    }

    function _then(resolveFn, rejectFn, breakFn) {
        this._promise = this._promise.then(_modifyWithCheck(this, resolveFn, breakFn), _modifyWithCheck(this, rejectFn, breakFn));

        return this;
    }

    function _catch(rejectFn) {
        this._promise = this._promise.catch(_modifyWithCheck(this, rejectFn));

        return this;
    }

    function _modifyWithCheck(promise, defaultFn, breakFn) {
        if (!CheckType.exists(defaultFn)) {
            return;
        }

        return function(result) {
            if (promise._breaked) {
                if (!promise._breakFnFired && CheckType.func(breakFn)) {
                    promise._breakFnFired = true;

                    breakFn.call(promise, result);
                }

                return result;
            }

            if (CheckType.func(defaultFn)) {
                return defaultFn.call(promise, result);
            }

            return result;
        }
    }

    return FlowPromise;
});
