<?php

namespace Glifery\VkApiBundle\DependencyInjection;

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
class GliferyVkApiExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $container->setParameter('glifery_vk_api.api_version', $config['api_version']);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
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
