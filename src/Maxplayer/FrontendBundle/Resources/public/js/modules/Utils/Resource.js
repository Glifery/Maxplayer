define([
    'Utils/CheckType',
    'Utils/Debug',
    'jquery',
    'underscore',
    'Utils/Text/Text',
    'Utils/Text/Handlers/Replace'
], function(
    checkType,
    debug,
    $,
    _,
    $text,
    $textReplaceHandler
){
    var console = debug.console(['utils/resource']),
        consoleProcess = console.console('process'),
        consoleError = console.console('error'),
        consoleAjax = console.console('ajax');

    var requiredOptsFields = ['url'],
        defaultOpts= {
            method: 'GET',
            urlReplace: {
                start: '{',
                stop: '}'
            }
        };

    var ResourceClass = Resource;

    function Resource(opts) {
        this.opts = $.extend(true, defaultOpts, opts);
    }

    ResourceClass.prototype.addRoute = _addRoute;

    /**
     *
     * @param object fields
     * @param object obj
     * @returns {boolean}
     */
    function _checkExisting(fields, obj) {
        var isError = false;
        consoleProcess.log('checkExisting beg', fields, obj);

        for (var index in fields) {
            if (!checkType.has(obj, fields[index])) {
                isError = true;

                consoleError.log('Try to create resource whithout parameter', fields[index]);
            }
        }

        consoleProcess.log('checkExisting end: isError', isError);

        return !isError;
    }

    /**
     *
     * @param string url
     * @param object opts
     * @returns {*}
     */
    function _prepareUrl(url, opts) {
        var textTransformer = $text();
        consoleProcess.log('prepareUrl beg', url, opts);

        if (checkType.obj(opts) && checkType.has(opts, 'params')) {
            var handler = $textReplaceHandler(opts.params, {startSymbol: opts.urlReplace.start, endSymbol: opts.urlReplace.stop});

            textTransformer
                .handler(handler)
                .setText(url);

            url = textTransformer.getText();
        }

        if ((url.indexOf(opts.urlReplace.start) != -1) || (url.indexOf(opts.urlReplace.stop) != -1)) {
            consoleError.log('Incorrect URL (with placeholders)', url);
        }

        consoleProcess.log('prepareUrl end', url);

        return url;
    }

    /**
     *
     * @param string name
     * @param object routeOpts
     * @returns Resource
     */
    function _addRoute(name, routeOpts) {
        var routeFunction = _createRouteFunction(routeOpts, this.opts);

        this[name] = routeFunction;

        return this;
    }

    /**
     *
     * @param object routeOpts
     * @param object resourceOpts
     * @returns {Function}
     */
    function _createRouteFunction(routeOpts, resourceOpts) {
        var opts = {},
            routeUrl = '';

        consoleProcess.log('createRouteFunction beg', opts);

        if (checkType.has(resourceOpts, 'url') && resourceOpts.url.length) {
            routeUrl += resourceOpts.url;
        }
        if (checkType.has(routeOpts, 'url') && routeOpts.url.length) {
            routeUrl += routeOpts.url;
        }

        _.extend(opts, resourceOpts, routeOpts);
        _.extend(opts.params, resourceOpts.params, routeOpts.params);

        opts.url = _prepareUrl(routeUrl, opts);

        _checkExisting(requiredOptsFields, opts);

        return function(params) {
            var ajaxParams = {},
                ajaxData = opts
            ;

            $.extend(true, ajaxParams, opts.params, params);
            ajaxData.data = ajaxParams;

            ajaxPromise = _returnAjaxPromise(ajaxData);

            return ajaxPromise;
        }
    }

    function _returnAjaxPromise(ajaxData) {
        var ajaxPromise = new Promise(function(ajaxResolve, apaxReject) {
                $.ajax(ajaxData)
                    .done(_defaultSuccessCallback)
                    .done(function(responce) {ajaxResolve(responce)})
                    .fail(_defaultErrorCallback)
                    .fail(function(xhr) {apaxReject(xhr)});
            })
            .then(
                function(result) {
                    var newResult;

                    if (ajaxData.hasOwnProperty('done') && (checkType.func(ajaxData.done))) {
                        newResult = ajaxData.done(result);
                        if (checkType.exists(newResult)) {
                            return Promise.resolve(newResult);
                        }
                    }

                    return Promise.resolve(result);
                },
                function(result) {
                    var newResult;

                    if (ajaxData.hasOwnProperty('fail') && (checkType.func(ajaxData.fail))) {
                        newResult = ajaxData.fail(result);
                        if (checkType.exists(newResult)) {
                            return Promise.reject(newResult);
                        }
                    }

                    return Promise.reject(result);
                }
            )
            .then(
                function(result) {
                    var newResult;

                    if (ajaxData.hasOwnProperty('then') && (checkType.func(ajaxData.then))) {
                        newResult = ajaxData.then(result);
                        if (checkType.exists(newResult)) {
                            return Promise.resolve(newResult);
                        }
                    }

                    return Promise.resolve(result);
                },
                function(result) {
                    var newResult;

                    if (ajaxData.hasOwnProperty('then') && (checkType.func(ajaxData.then))) {
                        newResult = ajaxData.then(result);
                        if (checkType.exists(newResult)) {
                            return Promise.reject(newResult);
                        }
                    }

                    return Promise.reject(result);
                }
            )
        ;

        return ajaxPromise;
    }

    function _defaultSuccessCallback(responce, textStatus, xhr) {
        consoleAjax.info('ajax', xhr.status, xhr.statusText, this.url, responce, xhr);
    }

    function _defaultErrorCallback(xhr) {
        try {
            var response = $.parseJSON(xhr.responseText),
                code   = response.code || '500',
                message  = response.message || 'Error occurred';
        } catch (e) {
            var code  = xhr.status,
                message = xhr.statusText;
        }

        consoleAjax.error('ajax', code, message, this.url, xhr);
        consoleError.error('ajax error:', code, message);
    }

    return Resource;
});