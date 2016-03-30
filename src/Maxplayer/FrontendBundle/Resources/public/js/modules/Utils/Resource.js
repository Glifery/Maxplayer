define([
    'jquery',
    'underscore',
    'Utils/Text/Text',
    'Utils/Text/Handlers/Replace'
], function(
    $,
    _,
    $text,
    $textReplaceHandler
){
    var ResourceClass = Resource,
        register = {}
    ;

    ResourceClass.prototype.addRoute = _addRoute;

    var defaultOpts = {
        method: 'GET',
        urlReplace: {
            start: '{',
            stop: '}'
        }
    };

    function Resource(opts, data) {
        this._opts = {};
        this._data = data ? data : {};
        this._routes = {};

        _.extend(this._opts, defaultOpts, opts);
    }

    function _addRoute(routeName, opts, data) {
        var routeInfo = {
            routeName: routeName,
            data: data ? _.extend({}, this._data, data) : _.clone(this._data),
            opts: opts ? _.extend({}, this._opts, opts) : _.clone(this._opts)
        };

        routeInfo['opts']['url'] = _mergeUrls(this._opts, opts);

        this._routes[routeName] = routeInfo;
        this[routeName] = _createRouteFunction(this, routeName);

        return this;
    }

    function _createRouteFunction(resource, routeName) {
        return function(data, opts) {
            var routeInfo = resource._routes[routeName],
                actualData = data ? _.extend({}, routeInfo.data, data) : _.clone(routeInfo.data),
                actualOpts = opts ? _.extend({}, routeInfo.opts, opts) : _.clone(routeInfo.opts),
                promise = null
            ;

            actualOpts['url'] = _mergeUrls(routeInfo.opts, opts);
            actualOpts['url'] = _handleUrl(actualOpts['url'], actualData, actualOpts);

            promise = new Promise(function(resolve, reject) {
                actualOpts['data'] = actualData;

                $.ajax(actualOpts)
                    .done(function(response, textStatus, xhr) {
                        if (typeof actualOpts['done'] === 'function') {
                            resolve(actualOpts['done'](response, textStatus, xhr));

                            return;
                        }

                        resolve(response);
                    })
                    .fail(function(xhr) {
                        try {
                            var responseText = $.parseJSON(xhr.responseText),
                                code = response.code || '500',
                                message = response.message || 'Error occurred';
                        } catch (e) {
                            var responseText = '',
                                code = xhr.status,
                                message = xhr.statusText;
                        }

                        var response = {
                            responseText: responseText,
                            code: code,
                            message: message,
                            request: actualOpts,
                            route: routeName
                        };

                        if (typeof actualOpts['fail'] === 'function') {
                            reject(actualOpts['fail'](response, xhr));

                            return;
                        }

                        reject(response);
                    })
                ;
            });

            return promise;
        }
    }

    function _mergeUrls(leftUrlObject, rightUrlObject) {
        var leftUrl = ((typeof leftUrlObject === 'object') && leftUrlObject.hasOwnProperty('url')) ? leftUrlObject['url'] : '',
            rightUrl = ((typeof rightUrlObject === 'object') && rightUrlObject.hasOwnProperty('url')) ? rightUrlObject['url'] : ''
        ;

        return leftUrl + rightUrl;
    }

    function _handleUrl(url, data, opts) {
        var textTransformer = $text(),
            handler = $textReplaceHandler(
                data,
                {
                    startSymbol: opts.urlReplace.start,
                    endSymbol: opts.urlReplace.stop,
                    removeMatch: true
                }
            ),
            handledUrl = textTransformer.handler(handler).setText(url).getText();
        ;


        if ((handledUrl.indexOf(opts.urlReplace.start) != -1) || (handledUrl.indexOf(opts.urlReplace.stop) != -1)) {
            console.error('Can\'t replace all placeholders in "' + handledUrl + '" url')
        }

        return handledUrl;
    }

    return Resource;
});