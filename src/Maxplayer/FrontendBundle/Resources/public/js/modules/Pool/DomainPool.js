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

        if (domain.get('id')) {
            request.id = domain.get('id');
        } else if (domain.get('mbid')) {
            request.mbid = domain.get('mbid');
        } else {
            request[domainCode] = domain.get('name');
        }

        return request;
    }

    function _populateCollection(responseElements, eachCallback) {
        var _this = this,
            collection = new Collection()
        ;

        _.each(responseElements, function(item) {
            var domain = _this.findOrCreate(item);

            if (typeof eachCallback === 'function') {
                eachCallback.call(_this, domain);
            }

            collection.addDomain(domain);
        });

        return collection;
    }

    function _findDomainInPool(domainPool, info, domainCode) {
        if (!domainPool.pool.hasOwnProperty(domainCode)) {
            return null;
        }

        if (info.hasOwnProperty('id') && domainPool.pool[domainCode].hasOwnProperty(info.id)) {
            return domainPool.pool[domainCode][info.id];
        }

        if (info.hasOwnProperty('mbid') && domainPool.pool[domainCode].hasOwnProperty(info.mbid)) {
            return domainPool.pool[domainCode][info.mbid];
        }

        if (info.hasOwnProperty('name') && domainPool.pool[domainCode].hasOwnProperty(info.name)) {
            return domainPool.pool[domainCode][info.name];
        }

        return null;
    }

    function _registerDomainInPool(domainPool, domain, domainCode) {
        if (domain.get('mbid')) {
            domainPool.pool[domainCode][domain.get('mbid')] = domain;
        }
        if (domain.get('name')) {
            domainPool.pool[domainCode][domain.get('name')] = domain;
        }
    }

    function _findOrCreate(info, anotherDomainCode) {
        var domainCode = anotherDomainCode ? anotherDomainCode : this.domainCode,
            foundDomain = _findDomainInPool(this, info, domainCode)
        ;

        if (foundDomain) {
            return foundDomain;
        }

        var domain = this.createNewDomain();

        if (info.hasOwnProperty('id')) {
            domain.set('id', info.id);
        }
        if (info.hasOwnProperty('mbid')) {
            domain.set('mbid', info.mbid);
        }
        if (info.hasOwnProperty('name')) {
            domain.set('name', info.name);
        }
        if (info.hasOwnProperty('artists')) {
            for (var index in info.artists) {
                var artistInfo = info.artists[index],
                    artistElement = this.findOrCreate(artistInfo, 'artist')
                ;

                if (!domain._relation_artist) {
                    domain._relation_artist = artistElement;
                    domain.set('artist', artistElement.get('name'));
                }
            }
        }
        if (info.hasOwnProperty('artist')) {
            var artistInfo = (typeof info.artist === 'object') ? info.artist : {'name': info.artist},
                artistElement = this.findOrCreate(artistInfo, 'artist')
            ;

            domain._relation_artist = artistElement;
            domain.set('artist', artistElement.get('name'));
        }
        if (info.hasOwnProperty('album')) {
            var albumInfo = info.album,
                albumElement = this.findOrCreate(albumInfo, 'album')
            ;

            if ((!albumElement._relation_artist) && domain._relation_artist) {
                albumElement._relation_artist = domain._relation_artist;
                albumElement.set('artist', domain._relation_artist.get('name'));
            }

            if (!domain._relation_album) {
                domain._relation_album = albumElement;
                domain.set('album', albumElement.get('name'));
            }
        }
        if (info.hasOwnProperty('id')) {
            domain.set('id', info.id);
        }
        if (info.hasOwnProperty('images')) {
            domain.set('images', _normalizeImages(info.images));
        }
        if (info.hasOwnProperty('image')) {
            domain.set('images', _normalizeImages(info.image));
        }

        _registerDomainInPool(this, domain, domainCode);

        return domain;
    }

    function _normalizeImages(imagesInfo) {
        var images = {};

        for (var index in imagesInfo) {
            if (imagesInfo[index].size) {
                images[imagesInfo[index].size] = imagesInfo[index]['#text'];
            } else if (imagesInfo[index].width) {
                images[imagesInfo[index].width] = imagesInfo[index].url;
            }
        }

        return images;
    }

    return DomainPoolClass;
});
