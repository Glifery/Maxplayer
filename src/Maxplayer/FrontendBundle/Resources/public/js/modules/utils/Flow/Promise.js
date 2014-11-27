define([
    'Utils/CheckType',
    'Utils/Flow/ThenChain'
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
        var _bodyFn = bodyFn,
            _resolvedResults = null,
            _rejectedResults = null,
            _status = 0,//0 - not fired, 1 - firing, 2 - resolved, 3 - rejected
            _thenChain = new ThenChain;
        ;

        if (typeof _bodyFn !== 'function') {
            throw new Error('trying to create instance of Promise with no specifying body function: incorrect \'fn\' argument (typeof '+typeof _bodyFn+')')
        }

        //TODO: move out functions from object to prototype (difficult)
        function _resolve() {
            _validateOnEndStatus(2);

            _status = 2;
            _resolvedResults = arguments;

            _callOnEndFunction();
        }

        function _reject() {
            _validateOnEndStatus(3);

            _status = 3;
            _rejectedResults = arguments;

            _callOnEndFunction();
        }

        var promiseInnerInterface = {
            resolve: _resolve,
            reject: _reject
        };

        function _then() {
            var thenLink = _thenChain.createLink.apply(_thenChain, arguments);

            _thenChain.push(thenLink);

            return promiseOuterInterface;
        }

        function _callOnEndFunction() {
            var onEndFn = null;

            switch (_status) {
                case 2:
                    onEndFn = _thenChain.getOnResolveFn();
                    if (typeof onEndFn === 'function') {
                        onEndFn.apply(promiseOuterInterface, _resolvedResults);
                    }
                    break;
                case 3:
                    onEndFn = _thenChain.getOnRejectFn();
                    if (typeof onEndFn === 'function') {
                        onEndFn.apply(promiseOuterInterface, _rejectedResults);
                    }
                    break;
            }
        }

        function _fireBodyFn() {
            if (_status === 0) {
                _status = 1;
                bodyFn(promiseInnerInterface);
            }

            return promiseOuterInterface;
        }

        function _validateOnEndStatus(onEndEventStatus) {
            if (_status !== 1) {
                throw new Error('calling Promise event \''+promiseStatuses[onEndEventStatus]+'\' on Promise with status \''+promiseStatuses[_status]+'\'');
            }
        }

        var promiseOuterInterface = {
            then: _then,
            fire: _fireBodyFn
        }

        return promiseOuterInterface;
    };

    return PromiseClass;
});