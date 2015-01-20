define([
    'Utils/CheckType',
    'Utils/Flow/CustomPromise/ThenChain'
], function (
    CheckType,
    ThenChain
    ) {
    var promiseStatuses = {
        0: 'not fired',
        1: 'firing',
        2: 'resolved',
        3: 'rejected'
    };

    var PromiseClass = Promise;

    function Promise(bodyFn) {
        var _this = this,
            _bodyFn = bodyFn,
            _status = 0,//0 - not fired, 1 - firing, 2 - resolved, 3 - rejected
            _thenChain = new ThenChain;
        ;

        if (typeof _bodyFn !== 'function') {
            throw new Error('trying to create instance of Promise with no specifying body function: incorrect \'fn\' argument (typeof '+typeof _bodyFn+')')
        }

        //TODO: move out functions from object to prototype (difficult)
        function _resolve() {
            _status = 2;

            _callOnEndFunction.apply(_this, arguments);
        }

        function _reject() {
            _status = 3;

            _callOnEndFunction.apply(_this, arguments);
        }

        function _then() {
            var thenLink = _thenChain.createLink.apply(_thenChain, arguments);

            _thenChain.push(thenLink);

            return _this;
        }

        function _callOnEndFunction() {
            switch (_status) {
                case 2:
                    var onEndFn = _thenChain.getOnResolveFn();
                    break;
                case 3:
                    var onEndFn = _thenChain.getOnRejectFn();
                    break;
                default:
                    throw new Error('unexpected Promise status: ' + _status + 'when calling onEnd function');
            }

            _recursiveCallOnEndFu(onEndFn, arguments);
        }

        function _recursiveCallOnEndFu(onEndFn, arguments) {
            if (typeof onEndFn === 'function') {
                var onEndFnResult = onEndFn.apply(_this, arguments);

                if (typeof onEndFnResult === 'undefined') {
                    return;
                }

                if (onEndFnResult instanceof Promise) {
                    var closestLink = _thenChain.getClosestLink();
                    onEndFnResult.getThenChain().push(closestLink);
                    onEndFnResult.fire();
                } else {
                    var nextOnEndFn = _thenChain.getOnResolveFn();

                    _recursiveCallOnEndFu(nextOnEndFn, [onEndFnResult]);
                }
            }
        }

        function _fireBodyFn() {
            if (_status === 0) {
                _status = 1;

                bodyFn.call(_this, _resolve, _reject);
            }

            return _this;
        }

        function _getThenChain() {
            return _thenChain;
        }

        function _validateOnEndStatus(onEndEventStatus) {
            if (_status !== 1) {
                throw new Error('calling Promise event \''+promiseStatuses[onEndEventStatus]+'\' on Promise with status \''+promiseStatuses[_status]+'\'');
            }
        }

        this.then = _then;
        this.fire = _fireBodyFn;
        this.getThenChain = _getThenChain;
    };

    return PromiseClass;
});