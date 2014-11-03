<?php

namespace Maxplayer\VkApiBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class MaxplayerVkApiExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');

        $container->setParameter('vk_api.app_key', $config['app_key']);
        $container->setParameter('vk_api.app_secret', $config['app_secret']);
        $container->setParameter('vk_api.app_scope', $config['app_scope']);
        $container->setParameter('vk_api.auth_path', $config['auth_path']);
    }

    /**
     * Allow an extension to prepend the extension configurations.
     *
     * @param ContainerBuilder $container
     */
    public function prepend(ContainerBuilder $container)
    {
        $additionalConfig = array(
            'handlers' => array(
                'vk_api' => array(
                    'type' => 'stream',
                    'path' => '%kernel.logs_dir%/vk_api.log',
                    'level' => 'debug',
                    'channels' => 'vk_api'
                )
            ),
            'channels' => array('vk_api')
        );

        foreach ($container->getExtensions() as $bundleName => $extension) {
            switch ($bundleName) {
                case 'monolog':
                    $container->prependExtensionConfig($bundleName, $additionalConfig);
                    break;
            }
        }
    }
}
