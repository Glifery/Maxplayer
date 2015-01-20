define([
    'Utils/CheckType',
    'Utils/Flow/Promise/Promise',
    'Utils/Flow/Promise'
], function (
    CheckType,
    Promise,
    FlowPromise
    ) {
    var module = {
        promise: Promise,
        track: FlowPromise
    };

    return module;
});

/*

new Flow
    .promise(function(resolve, reject) {
        this - Promise

        resolve(result)
            ..or..
        reject(result)
    })
    .then(
        ..resolve fn:..
        function(result) {
            return new Flow.promise(...) - inject inner Promise to outer workflow
                ..or..
            return ..value..; - fire next then-function
                ..or..
            ..nothing.. - rest then-functions do not fire
        },
        ..reject fn:..
        function(result) {
            ..look above..
        }
    )
    .then(...)
    ...
    .fire();
;


 */