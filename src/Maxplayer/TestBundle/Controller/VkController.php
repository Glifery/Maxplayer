<?php

namespace Maxplayer\TestBundle\Controller;

use getjump\Vk\Core;
use getjump\Vk\Auth;
use Maxplayer\VkApiBundle\Service\VkTransport;
use Maxplayer\VkRequestBundle\Model\ApiRequest;
use Maxplayer\VkRequestBundle\Service\VkGate;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class VkController extends Controller
{
    public function requestAction()
    {
        /** @var VkGate $vk */
        $vk = $this->get('maxplayer_vk_request.vk_gate');

        $apiRequest = new ApiRequest();
        $apiRequest
            ->setMethod('users.get')
            ->addParam('user_ids', array(7991516, 7991517))
            ->addParam('fields', array('sex', 'city'))
        ;

        $apiResponce = $vk->call($apiRequest);

        if ($apiResponce->isSuccess()) {
            foreach ($apiResponce->getData() as $item) {
                $item = $item;
            }
        }

        return new Response('requestAction');
    }

    public function soundAction()
    {
        /** @var VkTransport $vk */
        $vk = $this->get('maxplayer_vk_api.vk_transport');
        if ($result = $vk->call('users.get', array(
                'user_ids' => array(7991516,7991515),
                'fields' => array('sex', 'city')
            ))) {
            $eee = $result;
        } else {
            $eee = $vk->getLastError();
        }

        return new Response('');
    }

    public function authAction()
    {
        $apiKey = $this->container->getParameter('vk_api_key');
        $apiSecret = $this->container->getParameter('vk_api_secret');
        $scope = 'friends,photos,audio,video,docs,status,email,notifications,stats,offline';

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