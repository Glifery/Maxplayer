define([
    'Utils/Debug',
    'Utils/CheckType'
], function(
    debug,
    checkType
) {
    var console = debug.console(['utils/text', 'utils/text/handlers', 'utils/text/handlers/replace']),
        consoleProcess = console.console('process'),
        consoleError = console.console('error'),
        consoleReplace = console.console('replace');

    var defaultOpts = {
        startSymbol: '{{',
        endSymbol: '}}'
    }

    var handler = function(args, opts) {
        this._replaceMap = args;
        this._opts = mergeObjects(defaultOpts, opts);
        this.handle = handle;

        consoleProcess.log('handler args:', args);
        consoleProcess.log('handler opts:', opts);
    }

    function handle(text) {
        consoleReplace.log('start replace for', text);

        return replace(text, this._replaceMap, this._opts, '');
    }

    function replace(string, replaceMap, opts, root) {
        var reg = null;

        for (var pattern in replaceMap) {
            consoleReplace.log('..start pattern', root+pattern);

            if (checkType.has(replaceMap, pattern)) {
                consoleReplace.log('....pattern', root+pattern,'is own property');

                if (!checkType.obj(replaceMap[pattern]) && !checkType.arr(replaceMap[pattern])) {
                    reg = new RegExp(normalizePattern(root+pattern, opts), 'g');
                    consoleReplace.log('......pattern', normalizePattern(root+pattern, opts), 'transform to reg', reg);

                    string = string.replace(reg, replaceMap[pattern]);
                    consoleReplace.log('......replace', root+pattern, 'to', replaceMap[pattern], ': result', string);
                } else {
                    consoleReplace.log('......requrcy! deep to', replaceMap[pattern], 'with prefix', root+pattern+'.');

                    string = replace(string, replaceMap[pattern], opts, root+pattern+'.');
                }
            }
        }

        return string;
    }

    function normalizePattern(pattern, opts) {
        return opts.startSymbol+pattern+opts.endSymbol;
    }

    function mergeObjects(objBase, objAdditional) {
        consoleProcess.log('merge', objBase, objAdditional);

        if (checkType.obj(objBase)) {
            if (checkType.obj(objAdditional)) {
                for (var index in objAdditional) {
                    objBase[index] = objAdditional[index];
                }
            }

            consoleProcess.log('merge result', objBase);
            return objBase;
        }

        consoleError('merge error:', objBase, 'is not a base object');
        return {};
    }

    function handlerBuilder(args, opts) {
        return new handler(args, opts);
    }

    return handlerBuilder;
});