define([
    'Utils/CheckType'
], function (
    CheckType
) {
    var PromiseChainClass = PromiseChain,
        register = {}
    ;

    PromiseChainClass.find = _find;
    PromiseChainClass.prototype.break = _break;
    PromiseChainClass.prototype.then = _then;

    function _find(name) {
        return register[name];
    }

    function _makeUnique(flowPromise, name) {
        if (register[name]) {
            register[name].break();
        }
        register[name] = flowPromise;
    }

    function PromiseChain() {
        this._name = null;
        this._parent = null;
        this._breaked = false;

        if (typeof arguments[0] === 'function') {
            this._promise = new Promise(arguments[0]);
        } else if (typeof arguments[0] === 'string') {
            if (typeof arguments[1] === 'function') {
                this._promise = new Promise(arguments[1]);
            } else {
                this._promise = Promise.resolve();
            }

            this._name = arguments[0];
            _makeUnique(this, arguments[0]);
        } else {
            this._promise = Promise.resolve();
        }
    }

    function _break() {
        this._breaked = true;
    }

    function _recursiveCheckBreaked(flowPromise) {
        if (flowPromise._breaked || (!flowPromise._parent)) {
            return flowPromise._breaked;
        }

        return _recursiveCheckBreaked(flowPromise._parent);
    }

    function _modifyToCheck(flowPromise, thenFn) {
        return function() {
            if (_recursiveCheckBreaked(flowPromise)) {
                return;
            }

            try {
                var thenReturn = thenFn.apply(flowPromise, arguments);
            } catch (error) {
                throw error;
            }

            if ((typeof thenReturn === 'object') && (thenReturn.constructor.name === 'PromiseChain')) {
                thenReturn._parent = flowPromise;
            }

            return thenReturn;
        }
    }

    function _then(resolveFn, rejectFn) {
        var checkedResolveFn = (typeof resolveFn === 'function') ? _modifyToCheck(this, resolveFn) : null,
            checkedRejectFn = (typeof rejectFn === 'function') ? _modifyToCheck(this, rejectFn) : null
            ;

        this._promise = this._promise.then(checkedResolveFn, checkedRejectFn);

        return this;
    }

    return PromiseChain;
});
