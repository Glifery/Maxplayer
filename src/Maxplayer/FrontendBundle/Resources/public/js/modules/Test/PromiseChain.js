//http://maxplayer.my/app_dev.php/test/module/Test-PromiseChain

define([
    'App',
    'jquery',
    'Utils/PromiseChain'
], function (
    App,
    $,
    PromiseChain
) {
    console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

    new PromiseChain('play', function(resolve, reject) {
        console.log('Start play promise');

        setTimeout(function(){resolve(123)}, 600);
    })
        .then(function(result) {
            console.log('..then 1 result', result);

            return new PromiseChain('ppll', function(resolve) {
                setTimeout(function(){resolve(result + 2)}, 600);
            })
                .then(function(result) {
                    console.log('....then 1 result', result);

                    //new PromiseChain(this._name);
                    //throw new Error('dd');
                    //this._parent.break();
                    //PromiseChain.find('play').break();
                    //this.break();
                    return result + 3;
                })
                .then(function(result) {
                    console.log('....then 2 result', result);

                    //this.break();
                    return new PromiseChain(function(resolve) {setTimeout(function(){resolve(result + 2)}, 600);})
                        .then(function(result) {
                            console.log('......then 1 result', result);

                            return new PromiseChain(function(resolve) {setTimeout(function(){resolve(result + 2)}, 600);})
                                .then(function(result) {
                                    console.log('........then 1 result', result);

                                    this.break();
                                    console.log('break!');
                                    return new Promise(function(resolve){setTimeout(function(){resolve(result + 2)}, 600);})
                                        .then(function() {
                                            console.log('..........PROM 1 result', result);

                                            return result + 10;
                                        })
                                        ;
                                })
                                ;
                        })
                        ;

                    return result + 3;
                }, function(reject){
                    console.log('....REJECT 2 result', reject);

                    throw new Error('dd22');
                    return 345;
                })
                .then(function(result) {
                    console.log('....then 3 result', result);

                    return result + 3;
                })
                ;
        })
        .then(function(result) {
            console.log('..then 2 result', result, this._name);

            return result;
        }, function(result) {
            console.log('..REJECT 2 result', result);

            return result;
        })
    ;
});