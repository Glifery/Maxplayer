<?php

namespace Maxplayer\VkApiBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('maxplayer_vk_api');

        $rootNode
            ->children()
                ->scalarNode('app_key')->cannotBeEmpty()->end()
                ->scalarNode('app_secret')->cannotBeEmpty()->end()
                ->arrayNode('app_scope')
                    ->prototype('scalar')->end()
                ->end()
                ->scalarNode('auth_path')->defaultValue('auth')->end()
            ->end()
        ;

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        return $treeBuilder;
    }
}
