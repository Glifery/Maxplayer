define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore'
], function (
    CheckType,
    Debug,
    _
) {
    var DomainPoolClass = DomainPool;
    DomainPoolClass.prototype.pool = {};
    DomainPoolClass.prototype.findOrCreate = _findOrCreate;
    DomainPoolClass.prototype.createRequestByDomain = _createRequestByDomain;

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

    function _findOrCreate(info) {
        if (info.hasOwnProperty('mbid') && this.pool.hasOwnProperty(info.mbid)) {
            return this.pool[info.mbid];
        }

        if (info.hasOwnProperty('name') && this.pool.hasOwnProperty(info.name)) {
            return this.pool[info.name];
        }

        var domain = this.createNewDomain();

        if (info.hasOwnProperty('mbid')) {
            domain.set('mbid', info.mbid);
        }
        if (info.hasOwnProperty('name')) {
            domain.set('name', info.name);
        }
        if (info.hasOwnProperty('artist')) {
            domain.set('artist', info.artist);
        }
        if (info.hasOwnProperty('id')) {
            domain.set('id', info.id);
        }
        if (info.hasOwnProperty('image')) {
            domain.set('images', _normalizeImages(info.image));
        }

        return domain;
    }

    function _normalizeImages(imagesInfo, domain) {
        var images = {};

        for (var index in imagesInfo) {
            images[imagesInfo[index].size] = imagesInfo[index]['#text'];
        }

        return images;
    }

    return DomainPoolClass;
});
