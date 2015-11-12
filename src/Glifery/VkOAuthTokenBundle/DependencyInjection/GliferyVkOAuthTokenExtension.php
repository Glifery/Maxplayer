<?php

namespace Glifery\VkOAuthTokenBundle\DependencyInjection;

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
class GliferyVkOAuthTokenExtension extends Extension implements PrependExtensionInterface
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

        $container->setParameter('glifery_vk_oauth_token.app_key', $config['app_key']);
        $container->setParameter('glifery_vk_oauth_token.app_secret', $config['app_secret']);
        $container->setParameter('glifery_vk_oauth_token.app_scope', $config['app_scope']);
        $container->setParameter('glifery_vk_oauth_token.token_table', $config['token_table']);
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
                'vk_oauth_token' => array(
                    'type' => 'stream',
                    'path' => '%kernel.logs_dir%/vk_oauth_token.log',
                    'level' => 'debug',
                    'channels' => 'vk_oauth_token'
                )
            ),
            'channels' => array('vk_oauth_token')
        );

        foreach ($container->getExtensions() as $bundleName => $extension) {
            switch ($bundleName) {
                case 'monolog':
                    $container->prependExtensionConfig($bundleName, $additionalConfig);
                    break;
            }
        }
    }

    /**
     * The extension alias
     *
     * @return string
     */
    public function getAlias()
    {
        return 'glifery_vk_oauth_token';
    }
}
