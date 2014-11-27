define([
    'Utils/CheckType',
    'Utils/Flow/ThenLink'
], function (
    CheckType,
    ThenLink
    ) {
    var ThenChainClass = ThenChain;
    ThenChainClass.prototype.push = push;
    ThenChainClass.prototype.getOnResolveFn = getOnResolveFn;
    ThenChainClass.prototype.getOnRejectFn = getOnRejectFn;
    ThenChainClass.prototype.createLink = createLink;
    ThenChainClass.prototype.getClosestLink = getClosestLink;

    function ThenChain() {
        this.nextLink = null;
    }

    function createLink(onResolveFn, onRejectFn) {
        if (typeof onResolveFn !== 'function') {
            throw new TypeError(typeof onResolveFn + ' is not a onResolveFn function');
        }
        if ((typeof onRejectFn !== 'undefined') && (typeof onRejectFn !== 'function')) {
            throw new TypeError(typeof onRejectFn + ' is not a onRejectFn function');
        }

        return new ThenLink(onResolveFn, onRejectFn);
    }

    function push(thenLink) {
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

    function getOnResolveFn() {
        return getNextOnEndFn(this, 'onResolveFn');
    }

    function getOnRejectFn() {
        return getNextOnEndFn(this, 'onRejectFn');
    }

    function getNextOnEndFn(thenChain, onEndFnName) {
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

    function getClosestLink() {
        return this.nextLink;
    }

    return ThenChainClass;
});