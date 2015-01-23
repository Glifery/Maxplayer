define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'Api/LastFmResourceService',
    'Domain/Artist'
], function (
    CheckType,
    Debug,
    _,
    LastFmResourceService,
    Artist
) {
    var ArtistPoolServiceClass = ArtistPoolService;
    ArtistPoolServiceClass.prototype.domainCode = 'artist';
    ArtistPoolServiceClass.prototype.pool = {};
    ArtistPoolServiceClass.prototype.findOrCreate = _findOrCreate;
    ArtistPoolServiceClass.prototype.getSimilar = _getSimilar;

    function ArtistPoolService() {}

    function _getSimilar(domain) {
        var _this = this,
            request = _createRequestByDomain(domain, this.domainCode);

        return new Promise(function(resolve, reject) {
            LastFmResourceService
                .artistGetSimilar(request)
                .then(function(responce) {
                        var errorMessage = LastFmResourceService.catchError(responce);
                        if (errorMessage) {
                            reject(errorMessage);

                            return;
                        }

                        var artists = _.map(responce.similarartists.artist, function(item, key) {
                            return _this.findOrCreate(item);
                        });

                        resolve(artists);
                    },
                    function(responce) {
                        reject(responce);
                    }
                )
            ;
        });
    }

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

        var domain = _createNewDomain(this.domainCode);

        if (info.hasOwnProperty('mbid')) {
            domain.set('mbid', info.mbid);
        }
        if (info.hasOwnProperty('name')) {
            domain.set('name', info.name);
        }
        if (info.hasOwnProperty('name')) {
            domain.set('name', info.name);
        }
        if (info.hasOwnProperty('image')) {
            domain.set('images', _normalizeImages(info.image));
        }

        return domain;
    }

    function _createNewDomain(domainCode) {
        var domainName = domainCode.charAt(0).toUpperCase() + domainCode.slice(1),
            domain;

        eval('domain = new ' + domainName);

        return domain;
    }

    function _normalizeImages(imagesInfo, domain) {
        var images = {};

        for (var index in imagesInfo) {
            images[imagesInfo[index].size] = imagesInfo[index]['#text'];
        }

        return images;
    }

    return new ArtistPoolServiceClass();
});
