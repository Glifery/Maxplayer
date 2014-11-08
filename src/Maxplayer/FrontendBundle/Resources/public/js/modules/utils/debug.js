define([
    'Utils/CheckType',
    'underscore'
], function(
    checkType,
    _
) {
    var isPrint = true,
        defaultTags = [
            'all',
        ],
        defaultMatches = [];

    var localConsole = function(tags) {
        if (checkType.arr(tags)) {
            this._tags = tags;
        } else {
            this._tags = [];
        }

        this._tempTags = [];
    }
    localConsole.prototype.log = localLog;
    localConsole.prototype.info = localInfo;
    localConsole.prototype.error = localError;
    localConsole.prototype.warn = localWarn;
    localConsole.prototype.tag = addTags;
    localConsole.prototype.console = createConsole;

    function localLog() {
        if (isMatch(this)) {
            log.apply(console, arguments);
        }

        resetTags(this);

        return this;
    }

    function localInfo() {
        if (isMatch(this)) {
            info.apply(console, arguments);
        }

        resetTags(this);

        return this;
    }

    function localError() {
        if (isMatch(this)) {
            error.apply(console, arguments);
        }

        resetTags(this);

        return this;
    }

    function localWarn() {
        if (isMatch(this)) {
            warn.apply(console, arguments);
        }

        resetTags(this);

        return this;
    }

    function addTags(tags) {
        if (checkType.exists(tags)) {
            tags = checkType.toArr(tags);
            this._tempTags = _.union(this._tempTags, tags);
        }

        return this;
    }

    function createConsole(additionalTags) {
        var currentTags = getTags(this);

        if (checkType.exists(additionalTags)) {
            additionalTags = checkType.toArr(additionalTags);
            currentTags = _.union(currentTags, additionalTags);
        }

        resetTags(this);

        return new localConsole(currentTags);
    }

    function isMatch(context) {
        var tags = getTags(context),
            matches = _.intersection(defaultMatches, tags);

        if (checkType.arr(matches) && matches.length && (matches.length == defaultMatches.length)) {
            return true;
        }

        return false;
    }

    function getTags(context) {
        return _.union(context._tags, context._tempTags);
    }


    function resetTags(context) {
        context._tempTags = [];
    }

    function log() {
        if (isPrint) {
            console.log.apply(console, arguments);
        }

        return this;
    }

    function error() {
        if (isPrint) {
            console.error.apply(console, arguments);
        }

        return this;
    }

    function info() {
        if (isPrint) {
            console.info.apply(console, arguments);
        }

        return this;
    }

    function warn() {
        if (isPrint) {
            console.warn.apply(console, arguments);
        }

        return this;
    }

    function createLocalConsole(additionalTags) {
        var currentTags = defaultTags;

        if (checkType.exists(additionalTags)) {
            additionalTags = checkType.toArr(additionalTags);
            currentTags = _.union(currentTags, additionalTags);
        }

        return new localConsole(currentTags);
    }

    function setMatches(matches) {
        if(checkType.toArr(matches)) {
            defaultMatches = _.union(defaultMatches, matches);
            console.info('debug tags:', defaultMatches);
        }

        return this;
    }

    function setPrintStatus(printStatus) {
        isPrint = printStatus;

        if (isPrint) {
            console.info('debug print enable');
        }

        return this;
    }

    return {
        log: log,
        error: error,
        info: info,
        warn: warn,
        console: createLocalConsole,
        match: setMatches,
        print: setPrintStatus
    }
});