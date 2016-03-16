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

    function _createContext(origin, chain, event, callback, contextOrNull) {
        var context = contextOrNull ? contextOrNull : origin;

        return {
            origin: origin,
            chain: chain,
            event: event,
            callback: callback,
            callbackInContext: function() {
                var args = arguments;

                callback.apply(context, args);

                _triggerEndEventFire(args, this);
            },
            context: context
        }
    }

    //ModelEventService.on(player, 'currentTrack.sound', 'change', fn, player);
    function _on(origin, chain, event, callback, context) {
        var attributes = chain.split('.'),
            nextAttributeName = null,
            context = _createContext(origin, chain, event, callback, context)
        ;

        if (!attributes.length) {
            _endEventOn(context)(origin);

            return;
        }
        //_recursiveSetEndEvent(origin, attributes, _endEventOn(context));

        nextAttributeName = attributes.shift();
        origin.on('change:' + nextAttributeName, _recursiveSetTraverse(nextAttributeName, attributes, context), context);
        _triggerTraverseOn(origin, nextAttributeName, attributes, context);

        _triggerOn(context);
    }

    //'currentTrack', [sound]
    //'sound', []
    function _recursiveSetTraverse(attributeName, originAttributes, context) {
        var clonedAttributes = _.clone(originAttributes);

        //change:currentTrack (player, currentTrack)
        //change:sound (currentTrack, sound)
        return function (parentModel, attributeModel) {
            var attributes = _.clone(clonedAttributes),
                pleviousModel = parentModel.previous(attributeName),
                nextAttributeName = null
            ;

            _triggerTraverseFire(parentModel, attributeName, attributeModel, pleviousModel, attributes, context);

            if (!attributes.length) {
                if (pleviousModel && (pleviousModel instanceof Backbone.Model)) {
                    _endEventOff(context)(pleviousModel);
                }

                if (attributeModel instanceof Backbone.Model) {
                    _endEventOn(context)(attributeModel);
                }

                return;
            }

            if (pleviousModel && (pleviousModel instanceof Backbone.Model)) {
                _recursiveUnsetTraverse(pleviousModel, attributes, context);
                //***********************************************************************
                if (!attributes.length) {
                    _endEventOff(context)(pleviousModel);
                }
            }

            if (attributeModel instanceof Backbone.Model) {
                if (!attributes.length) {
                    _endEventOn(context)(attributeModel);
                }

                _recursiveSetEndEvent(attributeModel, attributes, _endEventOn(context));

                nextAttributeName = attributes.shift();
                attributeModel.on('change:' + nextAttributeName, _recursiveSetTraverse(nextAttributeName, attributes, context), context);
                _triggerTraverseOn(attributeModel, nextAttributeName, attributes, context);
            }
        }
    }

    function _recursiveUnsetTraverse(model, originAttributes, context) {
        var attributes = _.clone(originAttributes),
            nextAttributeName = attributes.shift(),
            nextModel = null;
        ;

        if(!(model instanceof Backbone.Model)) {
            return;
        }

        model.off('change:' + nextAttributeName, null, context);
        _triggerTraverseOff(model, nextAttributeName, attributes, context);

        nextModel = model.get(nextAttributeName);
        if (!(nextModel && (nextModel instanceof Backbone.Model))) {
            return;
        }

        if (!attributes.length) {
            _endEventOff(context)(nextModel);

            return;
        }

        _recursiveUnsetTraverse(nextModel, attributes, context)
    }

    //player, [currentTrack, sound]'
    //currentTrack, [sound]'
    function _recursiveSetEndEvent(model, originAttributes, endEventFunction) {
        var attributes = _.clone(originAttributes),
            nextAttributeName = attributes.shift(),
            nextModel = null
        ;

        nextModel = model.get(nextAttributeName);
        if (!(nextModel && (nextModel instanceof Backbone.Model))) {
            return;
        }

        if (!attributes.length) {
            endEventFunction(nextModel);

            return;
        }

        _recursiveSetEndEvent(nextModel, attributes, endEventFunction);
    }

    function _endEventOn(context) {
        return function(endModel) {
            endModel.off(context.event, null, context);
            endModel.on(context.event, context.callbackInContext, context);

            _triggerEndEventOn(endModel, context);
        }
    }

    function _endEventOff(context) {
        return function(endModel) {
            endModel.off(context.event, null, context);

            _triggerEndEventOff(endModel, context);
        }
    }

    function _triggerOn(context) {
        context.origin.trigger('chain:on chain', {
            event: 'chain:on',
            context: context
        });
    }

    function _triggerOff(context) {
        context.origin.trigger('chain:off chain', {
            event: 'chain:off',
            context: context
        });
    }

    function _triggerTraverseOn(model, attributeName, attributes, context) {
        context.origin.trigger('chain:traverse:on chain:traverse chain', {
            event: 'chain:traverse:on',
            model: model,
            attribute: attributeName,
            attributes: attributes,
            context: context
        });
    }

    function _triggerTraverseOff(model, attributeName, attributes, context) {
        context.origin.trigger('chain:traverse:off chain:traverse chain', {
            event: 'chain:traverse:off',
            model: model,
            attribute: attributeName,
            attributes: attributes,
            context: context
        });
    }

    function _triggerTraverseFire(model, attributeName, attributeModel, pleviousModel, attributes, context) {
        context.origin.trigger('chain:traverse:fire chain:traverse chain', {
            event: 'chain:traverse:fire',
            model: model,
            attribute: attributeName,
            previous: pleviousModel,
            value: attributeModel,
            attributes: attributes,
            context: context
        });
    }

    function _triggerEndEventOn(model, context) {
        context.origin.trigger('chain:end_event:on chain:end_event chain', {
            event: 'chain:end_event:on',
            model: model,
            context: context
        });
    }

    function _triggerEndEventOff(model, context) {
        context.origin.trigger('chain:end_event:off chain:end_event chain', {
            event: 'chain:end_event:off',
            model: model,
            context: context
        });
    }

    function _triggerEndEventFire(data, context) {
        context.origin.trigger('chain:end_event:fire chain:end_event chain', {
            event: 'chain:end_event:fire',
            data: data,
            context: context
        });
    }

    _.extend(Backbone.Model.prototype, {
        chainOn: function(attributesChain, event, callback, context) {
            _on(this, attributesChain, event, callback, context);

            return this;
        }
    });

    //return new ModelEventService();
});