define([
    'Utils/CheckType',
    'Utils/Flow/CustomPromise/ThenLink'
], function (
    CheckType,
    ThenLink
    ) {
    var ThenChainClass = ThenChain;
    ThenChainClass.prototype.push = _push;
    ThenChainClass.prototype.getOnResolveFn = _getOnResolveFn;
    ThenChainClass.prototype.getOnRejectFn = _getOnRejectFn;
    ThenChainClass.prototype.createLink = _createLink;
    ThenChainClass.prototype.getClosestLink = _getClosestLink;

    function ThenChain() {
        this.nextLink = null;
    }

    function _createLink(onResolveFn, onRejectFn) {
        if (typeof onResolveFn !== 'function') {
            throw new TypeError(typeof onResolveFn + ' is not a onResolveFn function');
        }
        if ((typeof onRejectFn !== 'undefined') && (typeof onRejectFn !== 'function')) {
            throw new TypeError(typeof onRejectFn + ' is not a onRejectFn function');
        }

        return new ThenLink(onResolveFn, onRejectFn);
    }

    function _push(thenLink) {
        if (!(thenLink instanceof ThenLink)) {
            throw new TypeError(typeof thenLink + ' is not a ThenLink object');
        }

        if (this.nextLink === null) {
            this.nextLink = thenLink;

            return this;
        }

        this.nextLink.push(thenLink);

        return this;
    }

    function _getOnResolveFn() {
        return _getNextOnEndFn(this, 'onResolveFn');
    }

    function _getOnRejectFn() {
        return _getNextOnEndFn(this, 'onRejectFn');
    }

    function _getNextOnEndFn(thenChain, onEndFnName) {
        if (thenChain.nextLink === null) {
            return null;
        }

        var linkWithOnEndFn = thenChain.nextLink.getLinkWithOnEndFn(onEndFnName);
        if (linkWithOnEndFn instanceof ThenLink) {
            thenChain.nextLink = linkWithOnEndFn.nextLink;

            return linkWithOnEndFn[onEndFnName];
        }

        return null;
    }

    function _getClosestLink() {
        return this.nextLink;
    }

    return ThenChainClass;
});