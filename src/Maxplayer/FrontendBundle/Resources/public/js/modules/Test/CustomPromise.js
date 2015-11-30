//http://maxplayer.my/app_dev.php/test/module/Test-CustomPromise

define([
    'Utils/Flow/Flow'
], function (
    Flow
    ) {
    var promise = new Flow.promise(function(resolve, reject) {
        console.log('..main body', this);
        resolve('rejectedData');

//        setInterval(function() {
//            resolve('resolvedData');
//        }, 1000);
    }).then(function(result) {
        console.log('..first (bridge) resolve');

        return result;
    });

    console.log('init promise:', promise);

    var self = promise
        .then(function(result) {
//                console.log('..resolve1:', result);

                return 42;

//                return new Flow.promise(function(resolve, reject) {
//                    resolve('resolved_inner');
//                });
            }
            ,
            function(result) {
                console.log('..reject1:', result);
            }
        )
        .then(function(result) {
                console.log('..resolve2:', result);

//                return 56;
                return new Flow.promise(function(resolve, reject) {
                        console.log('....body from inner Promise');

                        resolve('resolve from inner Promise');
//                        reject('reject from inner Promise');
                    }).then(function(result) {
                        console.log('....then from inner Promise:', result);
                        return 'back to main Promise';
                    });
            }
            , function(result) {
                console.log('..reject2:', result);
            }
        )
        .then(function(result) {
                console.log('..resolve3:', result, 'THIS WAY!!', this);
                this.then(function(result) {
                    console.log('..return 4 (additional):', result);
                    return 'rerurn to nowhere';
                });

                return 'return to additional Then';
            }, function(result) {
                console.log('..reject3:', result);
            }
        )
        .fire();
    ;
    console.log('after', self);

//    console.log('test FLOW!', promise);
});