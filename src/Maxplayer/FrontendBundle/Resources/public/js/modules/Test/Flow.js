define([
    'Utils/Flow/Flow'
], function (
    Flow
    ) {
    var promise = new Flow.promise(function(resolve, reject) {
        resolve('rejectedData');

//        setInterval(function() {
//            resolve('resolvedData');
//        }, 1000);
    });
    console.log('init promise', promise);
    promise
        .then(function(result) {
//                console.log('resolve1', result);

                return 42;

//                return new Flow.promise(function(resolve, reject) {
//                    resolve('resolved_inner');
//                });
            }
//            ,
//            function(result) {
//                console.log('reject1', result);
//            }
        )
        .then(function(result) {
                console.log('resolve2', result);

//                return 56;
                return new Flow.promise(function(resolve, reject) {
                        console.log('from inner Promise');

                        reject('from inner Promise');
                    }).then(function(result) {
                            console.log('new Then', result);
                    });
            }
            , function(result) {
                console.log('reject2', result);
            }
        )
        .then(function(result) {
                console.log('resolve3', result);
            }, function(result) {
                console.log('reject3', result);
            }
        )
        .fire();
    ;
    console.log('after');

//    console.log('test FLOW!', promise);
});