define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Domain/Collection'
], function (
    CheckType,
    Debug,
    _,
    Collection
) {
    var DomainPoolClass = DomainPool;
    DomainPoolClass.prototype.pool = {'artist': {}, 'album': {}, 'track': {}, 'tag': {}};
    DomainPoolClass.prototype.createRequestByDomain = _createRequestByDomain;
    DomainPoolClass.prototype.populateCollection = _populateCollection;
    DomainPoolClass.prototype.findOrCreate = _findOrCreate;

    function DomainPool() {}

    function _createRequestByDomain(domain, domainCode) {
        var request = {};

        if (domain.get('mbid')) {
            request.mbid = domain.get('mbid');
        } else {
            request[domainCode] = domain.get('name');
        }

        return request;
    }

    function _populateCollection(responseElements, sortCallback) {
        var _this = this,
            collection = new Collection()
        ;

        _.each(responseElements, function(item) {
            var domain = _this.findOrCreate(item),
                sort = (typeof sortCallback === 'function') ? parseFloat(sortCallback(item)) : null;
            ;

            collection.addDomain(domain, sort);
        });

        return collection;
    }

    function _findOrCreate(info, anotherDomainCode) {
        var domainCode = anotherDomainCode ? anotherDomainCode : this.domainCode;

        if (info.hasOwnProperty('mbid') && this.pool[domainCode].hasOwnProperty(info.mbid)) {
            return this.pool[domainCode][info.mbid];
        }

        if (info.hasOwnProperty('name') && this.pool[domainCode].hasOwnProperty(info.name)) {
            return this.pool[domainCode][info.name];
        }

        var domain = this.createNewDomain();

        if (info.hasOwnProperty('mbid')) {
            domain.set('mbid', info.mbid);
        }
        if (info.hasOwnProperty('name')) {
            domain.set('name', info.name);
        }
        if (info.hasOwnProperty('artist')) {
            var artistInfo = (typeof info.artist === 'object') ? info.artist : {'name': info.artist};

            domain._relation_artist = this.findOrCreate(artistInfo, 'artist');
            domain.set('artist', domain._relation_artist.get('name'));
        }
        if (info.hasOwnProperty('id')) {
            domain.set('id', info.id);
        }
        if (info.hasOwnProperty('image')) {
            domain.set('images', _normalizeImages(info.image));
        }

        if (info.hasOwnProperty('mbid')) {
            this.pool[domainCode][info.mbid] = domain;
        }
        if (info.hasOwnProperty('name')) {
            this.pool[domainCode][info.name] = domain;
        }

        return domain;
    }

    function _normalizeImages(imagesInfo) {
        var images = {};

        for (var index in imagesInfo) {
            images[imagesInfo[index].size] = imagesInfo[index]['#text'];
        }

        return images;
    }

    return DomainPoolClass;
});
