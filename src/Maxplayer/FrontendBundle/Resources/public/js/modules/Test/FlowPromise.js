//http://maxplayer.my/app_dev.php/test/module/Test-FlowPromise

define([
    'Utils/FlowPromise'
], function (
    FlowPromise
    ) {

    //!!! в then-функциях всегда возвращать промис!! Иначе следующий then будет считаться resolved
    var promises = {
        p1: function(input) {return generatePromise(1, true, input).then(function(result) {console.log('.....and (1) then --> \'' + result + '\''); return result;})},
        p2: function(input) {return generatePromise(2, false, input).then(function(result) {console.log('.....and (2) then --> \'' + result + '\''); return result;})},
        p3: function(input) {return generatePromise(3, true, input).then(function(result) {console.log('.....and (3) then --> \'' + result + '\''); return result;})},
        p4: function(input) {return generatePromise(4, true, input).then(function(result) {console.log('.....and (4) then --> \'' + result + '\''); return result;})},
        p5: function(input) {return generatePromise(5, true, input).then(function(result) {console.log('.....and (5) then --> \'' + result + '\''); return result;})}
    }
    var promise = new FlowPromise('foo');

    setTimeout(function() {
        console.log('BREAKED!-------');
        promise.break();
    }, 1900);

    promise
        .then(function(result) {console.log('--> start with:', result); return result})
        .then(promises.p1, function(result) {console.log('REJECT_1: ' + result)}, function(result) {console.log('BREAK_1: ' + result)})
        .then(promises.p2, function(result) {console.log('REJECT_2: ' + result)}, function(result) {console.log('BREAK_2: ' + result)})
        //.catch(function(result) {console.log('REJECT_3: ' + result, this)})
        //.then(promises.p3)
        .then(promises.p3, function(result) {console.log('REJECT_3: ' + result, this)})
        .then(promises.p4, function(result) {console.log('REJECT_4: ' + result)}, function(result) {console.log('BREAK_4: ' + result)})
        .then(promises.p5, function(result) {console.log('REJECT_5: ' + result)}, function(result) {console.log('BREAK_5: ' + result)})

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
            console.log('..' + index + ') \'' + input + '\' --> [promise body]');
            setTimeout(function() {
                if (isResolved) {
                    console.log('.....(' + index + ') resolved; --> \'' + input + '_resolved_' + index + '\'');
                    resolve(input + '_resolved_' + index);
                } else {
                    console.log('.....(' + index + ') rejected; --> \'' + input + '_rejected_' + index + '\'');
                    reject(input + '_rejected_' + index);
                }
            }, 1000);
        });
    }
});
