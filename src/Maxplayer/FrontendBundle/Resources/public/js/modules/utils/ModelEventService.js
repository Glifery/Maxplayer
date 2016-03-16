define([
    'underscore',
    'backbone'
], function(
    _,
    Backbone
){
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

    function _registerChainEvent(model, context) {
        model._chainEvents = model._chainEvents || {};
        model._chainEvents[context.chain] = model._chainEvents[context.chain] || {};
        model._chainEvents[context.chain][context.event] = model._chainEvents[context.chain][context.event] || [];
        model._chainEvents[context.chain][context.event].push(context);

        _triggerOn(context);
    }

    function _on(origin, chain, event, callback, context) {
        var context = _createContext(origin, chain, event, callback, context),
            attributes = chain.split('.')
        ;

        _recursiveSetTraverse(origin, attributes, context);
        _recursiveChangeEndEvent(origin, attributes, _endEventOn(context));
        _registerChainEvent(origin, context);
    }

    function _off(origin, chain, event, context) {
        if (!origin.hasOwnProperty('_chainEvents')) {
            return;
        }

        for (var chainVariant in origin._chainEvents) {
            for (var eventVariant in origin._chainEvents[chainVariant]) {
                origin._chainEvents[chainVariant][eventVariant] = _.filter(
                    origin._chainEvents[chainVariant][eventVariant],
                    function(contextVariant){
                        if (chain && (chainVariant !== chain)) {
                            return true;
                        }

                        if (event && (eventVariant !== event)) {
                            return true;
                        }

                        if (context && (contextVariant.context !== context)) {
                            return true;
                        }

                        _doOff(contextVariant);

                        return false;
                    }
                );
            }

            if (_.isEmpty(origin._chainEvents[chainVariant][eventVariant])) {
                origin._chainEvents[chainVariant] = _.omit(origin._chainEvents[chainVariant], eventVariant);
            }
        }

        if (_.isEmpty(origin._chainEvents[chainVariant])) {
            origin._chainEvents = _.omit(origin._chainEvents, chainVariant);
        }
    }

    function _doOff(context) {
        var attributes = context.chain.split('.');

        _recursiveUnsetTraverse(context.origin, attributes, context);
        _recursiveChangeEndEvent(context.origin, attributes, _endEventOff(context));

        _triggerOff(context);
    }

    function _recursiveSetTraverse(model, originAttributes, context) {
        var attributes = _.clone(originAttributes),
            attributeName = attributes.shift()
        ;

        if (!attributeName) {
            return;
        }

        var handler = function(parentModel, attributeModel) {
            var pleviousModel = parentModel.previous(attributeName);

            if (_checkBackboneModel(pleviousModel)) {
                _recursiveUnsetTraverse(pleviousModel, attributes, context);
                _recursiveChangeEndEvent(pleviousModel, attributes, _endEventOff(context));
            }

            if (_checkBackboneModel(attributeModel)) {
                _recursiveSetTraverse(attributeModel, attributes, context);
                _recursiveChangeEndEvent(attributeModel, attributes, _endEventOn(context));
            }

            _triggerTraverseFire(parentModel, attributeName, attributeModel, pleviousModel, attributes, context);
        };

        model.on('change:' + attributeName, handler, context);
        _triggerTraverseOn(model, attributeName, attributes, context);
    }

    function _recursiveUnsetTraverse(model, originAttributes, context) {
        var attributes = _.clone(originAttributes),
            nextAttributeName = attributes.shift(),
            nextModel = null;
        ;

        if (!nextAttributeName) {
            return;
        }

        model.off('change:' + nextAttributeName, null, context);
        _triggerTraverseOff(model, nextAttributeName, attributes, context);

        nextModel = model.get(nextAttributeName);
        if (_checkBackboneModel(nextModel)) {
            _recursiveUnsetTraverse(nextModel, attributes, context)
        }

    }

    function _recursiveChangeEndEvent(model, originAttributes, endEventFunction) {
        var attributes = _.clone(originAttributes),
            nextAttributeName = attributes.shift(),
            nextModel = null
        ;

        if (!nextAttributeName) {
            endEventFunction(model);

            return;
        }

        nextModel = model.get(nextAttributeName);
        if (_checkBackboneModel(nextModel)) {
            _recursiveChangeEndEvent(nextModel, attributes, endEventFunction);
        }
    }

    function _endEventOn(context) {
        return function(endModel) {
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

    function _checkBackboneModel(model) {
        if ((typeof model === 'object') && (model instanceof Backbone.Model)) {
            return true;
        }

        return false;
    }

    function _triggerOn(context) {
        context.origin.trigger('chain:on chain', {
            event: 'chain:on',
            model: context.origin,
            context: context
        });
    }

    function _triggerOff(context) {
        context.origin.trigger('chain:off chain', {
            event: 'chain:off',
            model: context.origin,
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
        },
        chainOff: function(attributesChain, event, context) {
            _off(this, attributesChain, event, context);

            return this;
        }
    });
});