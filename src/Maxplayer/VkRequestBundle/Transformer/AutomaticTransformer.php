<?php

namespace Maxplayer\VkRequestBundle\Transformer;

use Maxplayer\VkRequestBundle\Exception\TransformException;

abstract class AutomaticTransformer
{
    public function transformWithMap($responceObject, array $transformMap, \stdClass $item)
    {
        if (!is_object($responceObject)) {
            throw new TransformException('authomatic transformation fail: type of \'$responceObject\' is '.gettype($responceObject).', expected object');
        }

        if (!count($transformMap)) {
            throw new TransformException('authomatic transformation fail: \'$transrormMap\' is empty');
        }

        foreach ($transformMap as $responceProperty => $itemProperty) {
            $requestObjectSetterName = 'set'.ucfirst($responceProperty);

            if (!method_exists($responceObject, $requestObjectSetterName)) {
                throw new TransformException('authomatic transformation fail: responce object '.get_class($responceObject).' have no property \''.$responceProperty.'\'');
            }

            if (property_exists($item, $itemProperty)) {
                $value = $item->{$itemProperty};
                $responceObject->{$requestObjectSetterName}($value);
            }
        }
    }
}