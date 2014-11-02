<?php

namespace Maxplayer\TestBundle\Controller;

use getjump\Vk\Core;
use getjump\Vk\Auth;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class VkController extends Controller
{
    public function soundAction()
    {
        $apiKey = $this->container->getParameter('vk_api_key');
        $apiSecret = $this->container->getParameter('vk_api_secret');
        $token = 'e80591131359b5ff931b13890f72de840f4a9f00058f729580c313a2d76af3495e494d5d55055b388b1db';

        $vk = Core::getInstance()->apiVersion('5.26')->setToken($token);

        $vk
            ->request('audio.search', array(
                'q' => 'abba'
            ))
            ->each(function($qq, $ww) {
                    $ss = 2;
                })
        ;

        return new Response();
    }

    public function authAction()
    {
        $apiKey = $this->container->getParameter('vk_api_key');
        $apiSecret = $this->container->getParameter('vk_api_secret');
        $scope = 'friends,photos,audio,video,docs,status,email,notifications,stats,offline';
        $scope = 'friends,photos,audio,video,docs,status,email,notifications,stats';

        $request = $this->get('request');
        $router = $this->get('router');
        $redirectUri = $request->getScheme() . '://' . $request->getHttpHost() . $router->generate('maxplayer_test_vk_auth');

        $vk = Core::getInstance()->apiVersion('5.26');
        $auth = Auth::getInstance();
        $auth
            ->setAppId($apiKey)
            ->setScope($scope)
            ->setSecret($apiSecret)
            ->setRedirectUri($redirectUri)
        ;

        $tokenObj = null;
        if ($code = $request->query->get('code')) {
            /** @var \getjump\Vk\Response\Auth $tokenObj */
            $tokenObj = $auth->getToken($code);
        }
        if ($tokenObj) {
            $vk->setToken($tokenObj->token);
            $vk->request('users.get', ['user_ids' => range(1, 100)])->each(function($i, $v) {
                    if($v->last_name == '') return;
                    print $v->last_name . '<br>';
                });
        }

        return $this->render('MaxplayerTestBundle:Vk:auth.html.twig', array(
                'vk_api_key' => $apiKey,
                'tokenUrl' => $auth->getUrl()
            ));
    }
}