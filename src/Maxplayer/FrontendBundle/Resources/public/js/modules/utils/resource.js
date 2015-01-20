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

    /**
     *
     * @param object fields
     * @param object obj
     * @returns {boolean}
     */
    function checkExisting(fields, obj) {
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
    function prepareUrl(url, opts) {
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

    var Resource = function(opts) {
        this.opts = $.extend(true, defaultOpts, opts);
    }

    Resource.prototype.addRoute = addRoute;

    /**
     *
     * @param string name
     * @param object routeOpts
     * @returns Resource
     */
    function addRoute(name, routeOpts) {
        var routeFunction = createRouteFunction(routeOpts, this.opts);

        this[name] = routeFunction;

        return this;
    }

    /**
     *
     * @param object routeOpts
     * @param object resourceOpts
     * @returns {Function}
     */
    function createRouteFunction(routeOpts, resourceOpts) {
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

        opts.url = prepareUrl(routeUrl, opts);

        checkExisting(requiredOptsFields, opts);

        return function(params) {
            var ajaxParams = $.extend(true, opts.params, params),
                ajaxData = opts;

            ajaxData.data = ajaxParams;

            return $.ajax(ajaxData).done(defaultSuccessCallback).fail(defaultErrorCallback);
        }
    }

    function defaultSuccessCallback(responce, textStatus, xhr) {
        consoleAjax.info('ajax', xhr.status, xhr.statusText, this.url, responce, xhr);
    }

    function defaultErrorCallback(xhr) {
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

    return {
        create: function(opts) {
            return new Resource(opts);
        }
    }
});