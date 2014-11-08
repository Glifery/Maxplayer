define([
    'Utils/Debug',
    'Utils/CheckType'
], function(
    debug,
    checkType
) {
    var console = debug.console(['utils/text', 'utils/text/text']),
        consoleProcess = console.console('process'),
        consoleError = console.console('error');

    var obj = function(text) {
        this._origin = '';
        this._result = '';
        this._handlers = [];

        this.setText(text);
    }

    obj.prototype.setText = setText;
    obj.prototype.getText = getResult;
    obj.prototype.getOrigin = getOrigin;
    obj.prototype.handler = addHandler;

    function setText(text) {
        this._origin = '';

        if (checkType.exists(text)) {
            this._origin = text;
        }

        this._result = this._origin;

        consoleProcess.log('set text to', this._origin);

        return this;
    }

    function getOrigin() {
        return this._origin;
    }

    function getResult() {
        this._result = handleText(this._origin, this._handlers);

        return this._result;
    }

    function addHandler(handler) {
        if (checkType.exists(handler) && checkType.exists(handler.handle)) {
            consoleProcess.log('add handler', handler);

            this._handlers.push(handler);
        } else {
            consoleError.log('incorrect handler:', handler);
        }

        return this;
    }

    function handleText(text, handlers) {
        consoleProcess.log('start handle with', text);

        for (var index in handlers) {
            text = handlers[index].handle(text);

            consoleProcess.log('handle [%s]', index);
        }

        consoleProcess.log('end handle with', text);

        return text;
    }

    function objBuilder(text) {
        return new obj(text);
    }

    return objBuilder;
});