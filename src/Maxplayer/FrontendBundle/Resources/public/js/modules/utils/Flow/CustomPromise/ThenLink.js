define([
    'Utils/CheckType'
], function (
    CheckType
    ) {
    var ThenLinkClass = ThenLink;
    ThenLinkClass.prototype.push = _push;
    ThenLinkClass.prototype.getLinkWithOnEndFn = _getLinkWithOnEndFn;

    function ThenLink(onResolveFn, onRejectFn) {
        this.onResolveFn = onResolveFn;
        this.onRejectFn = onRejectFn;
        this.nextLink = null;
    }

    function _push(thenLink) {
        if (this.nextLink === null) {
            this.nextLink = thenLink;

            return this;
        }

        this.nextLink.push(thenLink);

        return this;
    }

    function _getLinkWithOnEndFn(onEndFnName) {
        if (typeof this[onEndFnName] === 'function') {
            return this;
        }

        if (this.nextLink === null) {
            return null;
        }

        return this.nextLink.getLinkWithOnEndFn(onEndFnName);
    }

    return ThenLinkClass;
});