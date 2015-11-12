<?php

namespace Glifery\VkOAuthTokenBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class OAuthController extends Controller
{
    /**
     * @Template()
     * @return array
     */
    public function requestAction()
    {
        return [
            'oAuthUrl' => $this->get('glifery_vk_oauth_token.vk_oauth')->generateOAuthUrl(),
            'lastToken' => $this->get('glifery_vk_oauth_token.token_manager')->getGlobalToken(),
            'appKey' => $this->getParameter('glifery_vk_oauth_token.app_key'),
            'appSecret' => $this->getParameter('glifery_vk_oauth_token.app_secret'),
            'scope' => $this->getParameter('glifery_vk_oauth_token.app_scope'),
        ];
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function callbackAction(Request $request)
    {
        if (!$code = $request->query->get('code')) {
            return new Responce(sprintf(
                    '%s: %s',
                    $request->query->get('error', 'Unknown OAuth error'),
                    $request->query->get('error_description', 'No description')
                ), 400);
        }

        $this->get('glifery_vk_oauth_token.vk_oauth')->requestTokenByCode($code);

        return $this->redirectToRoute('glifery_vk_oauth_token.oauth_request');
    }
}