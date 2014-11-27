define([
    'Utils/CheckType',
    'Utils/Flow/ThenLink'
], function (
    CheckType,
    ThenLink
    ) {
    var ThenChain = thenChainConstructor;
    ThenChain.prototype.push = push;
    ThenChain.prototype.getOnResolveFn = getOnResolveFn;
    ThenChain.prototype.getOnRejectFn = getOnRejectFn;
    ThenChain.prototype.createLink = createLink;

    function thenChainConstructor() {
        this.nextLink = null;
    }

    function createLink(onResolveFn, onRejectFn) {
        if (typeof onResolveFn !== 'function') {
            throw new Error('unexpected type of \'onResolveFn\' function: '+typeof onResolveFn);
        }
        if ((typeof onRejectFn !== 'undefined') && (typeof onRejectFn !== 'function')) {
            throw new Error('unexpected type of \'onRejectFn\' function: '+typeof onRejectFn);
        }

        return new ThenLink(onResolveFn, onRejectFn);
    }

    function push(thenLink) {
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

        return thenChain.nextLink.getOnEndFn(onEndFnName);
    }

    return ThenChain;
});