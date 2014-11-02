<?php

namespace Maxplayer\VkApiBundle\Controller;

use Maxplayer\VkApiBundle\Service\VkTransport;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AuthController extends Controller
{
    public function indexAction()
    {
        /** @var VkTransport $vkTransport */
        $vkTransport = $this->get('maxplayer_vk_api.vk_transport');

        $request = $this->get('request');
        $router = $this->get('router');
        $redirectUri = $request->getScheme() . '://' . $request->getHttpHost() . $router->generate('maxplayer_vk_api_auth_link');

        if ($code = $request->query->get('code')) {
            $vkTransport->getNewTokenByCode($code, $redirectUri);
            $this->get('session')->getFlashBag()->add(
                'auth',
                'Получен новый токен: '.$vkTransport->getToken()->getToken()
            );

            return $this->redirect($this->generateUrl('maxplayer_vk_api_auth_link'));
        }

        return $this->render('MaxplayerVkApiBundle:Auth:link.html.twig', array(
                'apiKey' => $vkTransport->getApiKey(),
                'authUrl' => $vkTransport->getAuthUrl($redirectUri),
                'token' => $vkTransport->getToken()
            ));
    }
}
