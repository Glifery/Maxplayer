require.config({
    "baseUrl": "bundles/maxplayerfrontend/js/modules",
    "paths": {
        "lib": "../lib",
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        "backbone": "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
        "underscore": "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min",
        "qunit": "//cdnjs.cloudflare.com/ajax/libs/qunit/1.14.0/qunit.min.js"
    },
    "shim": {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'qunit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

requirejs(['Utils/CheckType']);