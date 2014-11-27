define([
    'Utils/Flow/Flow'
], function (
    Flow
    ) {
    var promise = new Flow.promise(function(pr) {
        pr.reject('rejectedData');

        setInterval(function() {
            pr.resolve('resolvedData');
        }, 1000);
    });
    console.log('init promise', promise);
    promise
        .then(function(result) {
                console.log('resolve1', result);
            }
//            ,
//            function(result) {
//                console.log('reject1', result);
//            }
        )
        .then(function(result) {
                console.log('resolve2', result);
            }, function(result) {
                console.log('reject2', result);
            }
        )
        .fire();
    ;
    console.log('after');

//    console.log('test FLOW!', promise);
});