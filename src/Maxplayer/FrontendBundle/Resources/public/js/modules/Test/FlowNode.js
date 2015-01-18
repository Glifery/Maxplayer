//http://maxplayer.my/app_dev.php/test/module/Test-FlowNode

define([
    'Utils/Flow/Flow'
], function (
    Flow
    ) {

    var promises = {
        p1: function(input) {return generatePromise(1, true, input).then(function(result) {console.log('....1 then ' + result); return result;})},
        p2: function(input) {return generatePromise(2, true, input).then(function(result) {console.log('....2 then ' + result); return result;})},
        p3: function(input) {return generatePromise(3, true, input).then(function(result) {console.log('....3 then ' + result); return result;})},
        p4: function(input) {return generatePromise(3, true, input).then(function(result) {console.log('....4 then ' + result); return result;})}
    }
    var promise = new Flow.track;

    setTimeout(function() {
        console.log('BREAKED!-------');
        promise.break();
    }, 2900);

    promise
        .then(function(result) {console.log(123); return 123})
        .then(promises.p1, function(result) {console.log('REJECT1: ' + result)})
        .then(promises.p2, function(result) {console.log('REJECT2: ' + result)})
        .then(promises.p3, function(result) {console.log('REJECT3: ' + result)})
        .then(promises.p4, function(result) {console.log('REJECT4: ' + result)})

//        .then(track.check(promises.p1))
//        .then(track.check(promises.p2))
//        .then(track.check(promises.p3))
//        .then(track.check(promises.p3))
//        .then(
//            function(result) {console.log('RESULT: ' + result)},
//            function(result) {console.log('REJECT: ' + result)}
//        )

//    www = www.then(track.check(promises.p1));
//    www = www.then(track.check(promises.p2));
//    www = www.then(track.check(promises.p3));
//    www = www.then(track.check(promises.p3));
//    www = www.then(
//        function(result) {console.log('RESULT: ' + result)},
//        function(result) {console.log('REJECT: ' + result)}
//    );

//      .then(function(result) {
//            if (!breaked) {
//                return promises.p1();
//            }
//        })
//        .then(function(result) {
//            if (!breaked) {
//                return promises.p2();
//            }
//        })
//        .then(function(result) {
//            if (!breaked) {
//                return promises.p3();
//            }
//        })
    ;


//    Flow
//        .track(generateNode(1, true))
//        .then(generateNode(2, true))
//        .then(generateNode(3, true))
//    ;

    function generatePromise(index, isResolved, input) {
        return new Promise(function(resolve, reject) {
            console.log('..' + index + ') body (with ' + input + ')');
            setTimeout(function() {
                if (isResolved) {
                    console.log('....' + index + ') resolved');
                    resolve(input + ' rs' + index);
                } else {
                    console.log('....' + index + ') rejected');
                    reject(input + ' rj' + index);
                }
            }, 1000);
        });
    }
});