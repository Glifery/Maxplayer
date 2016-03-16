define([
    'Utils/CheckType',
    'Utils/Debug',
    'underscore',
    'backbone'
], function(
    checkType,
    debug,
    _,
    Backbone
){
    //var ModelEventServiceClass = ModelEventService;

    //ModelEventServiceClass.prototype.on = _on;

    //function ModelEventService() {};

    //ModelEventService.on(player, 'currentTrack.sound', 'change', fn, player);
    function _on(origin, attributesChain, event, callback, context) {
        console.log('!.', '_START chain \'' + attributesChain + '\' event \'' + event + '\'');
        var attributes = attributesChain.split('.');

        if (!context) {
            context = origin;
        }

        _recursiveSet(origin, attributes, _onEndEvent(event, callback, context));

        var nextAttributeName = attributes.shift();

        var level = '....';
        console.log('!.', '_FIRST for \'change:' + nextAttributeName + '\' events', attributes);
        origin.on('change:' + nextAttributeName, _recursiveChange(nextAttributeName, attributes, event, callback, level), context);
    }

    //'currentTrack', [sound]
    //'sound', []
    function _recursiveChange(attributeName, originAttributes, event, callback, level) {
        var clonedAttributes = _.clone(originAttributes);
        console.log(level, '_recursiveChange for \'change:' + attributeName + '\' attributes', clonedAttributes);

        //change:currentTrack (player, currentTrack)
        //change:sound (currentTrack, sound)
        return function (origin, attributeModel) {
            var attributes = _.clone(clonedAttributes),
                pleviousModel = null,
                nextAttributeName = null,
                context = this
            ;

            if (!attributes.length) {
                if ((pleviousModel = origin.previous(attributeName)) && (pleviousModel instanceof Backbone.Model)) {
                    console.log(level, '_OFF \'' + attributeName + '\' event', event);
                    pleviousModel.off(event, null, context);
                }

                if (attributeModel instanceof Backbone.Model) {
                    console.log(level, '_ON \'' + attributeName + '\' event', event);
                    attributeModel.off(event, null, context);
                    attributeModel.on(event, callback, context);
                }

                return;
            }

            if ((pleviousModel = origin.previous(attributeName)) && (pleviousModel instanceof Backbone.Model)) {
                _recursiveSet(pleviousModel, attributes, _offEndEvent(event, context));

                console.log(level, '_off CHANGE \'' + attributeName + '\' attributes', attributes);
                pleviousModel.off('change:' + nextAttributeName, null, context);
            }

            if (!(attributeModel instanceof Backbone.Model)) {
                return;
            }

            _recursiveSet(attributeModel, attributes, _onEndEvent(event, callback, context));

            nextAttributeName = attributes.shift();
            console.log(level, '_set CHANGE for ' + attributeName + '\'change:' + nextAttributeName + '\' attributes', attributes);
            level += '..';
            attributeModel.on('change:' + nextAttributeName, _recursiveChange(nextAttributeName, attributes, event, callback, level), context);
        }
    }

    //player, [currentTrack, sound]'
    //currentTrack, [sound]'
    function _recursiveSet(model, originAttributes, setFunction) {
        var attributes = _.clone(originAttributes),
            nextAttributeName = attributes.shift(),
            nextModel = null
        ;

        nextModel = model.get(nextAttributeName);
        if ((!nextModel) || (!(nextModel instanceof Backbone.Model))) {
            return;
        }

        if (!attributes.length) {
            if (typeof setFunction === 'function') {
                setFunction(nextModel);
            }

            return;
        }

        console.log('... _recursiveSet DEEP from \'' + nextAttributeName + '\' to', attributes);
        _recursiveSet(nextModel, attributes, setFunction);
    }

    function _onEndEvent(event, callback, context) {
        return function(endModel) {
            console.log('... _recursiveSet ON to');
            endModel.off(event, null, context);
            endModel.on(event, callback, context);
        }
    }

    function _offEndEvent(event, context) {
        return function(endModel) {
            console.log('... _recursiveSet OFF to');
            endModel.off(event, null, context);
        }
    }

    _.extend(Backbone.Model.prototype, {
        chainOn: function(attributesChain, event, callback, context) {
            _on(this, attributesChain, event, callback, context);

            return this;
        }
    });

    //return new ModelEventService();
});