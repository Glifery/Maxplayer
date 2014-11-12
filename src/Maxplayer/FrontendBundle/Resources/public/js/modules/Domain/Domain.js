define([
    'Utils/CheckType',
    'Utils/Debug',
    'backbone'
], function (
    CheckType,
    Debug,
    Backbone
    ) {

    var Domain = Backbone.Model.extend({
        initialize: function() {
            setPromisesToDomainAttributes(this);
        }
    });

    function setPromisesToDomainAttributes(domain) {
        var relations = domain.get('relations');

        relations.forEach(function(relationName) {
            var promise = getPromise(domain, relationName);

            domain.set('get'+relationName, promise);
        });
    }

    function getPromise(domain, relationName) {
        return new Promise(function(resolve, reject) {
            resolve(1);
        });
    }

    return Domain;
});

//artist
//    .get('genre')
//        .then(function(genre) {return genre.get('similarGenres')})
//        .then(Domain.get('Artist'))
//        .then()