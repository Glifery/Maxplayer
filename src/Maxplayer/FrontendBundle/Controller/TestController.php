<?php

namespace Maxplayer\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class TestController extends Controller
{
    public function testModuleAction($modulePath)
    {
        $modulePath = str_replace('-', '/', $modulePath);

        return $this->render('MaxplayerFrontendBundle:Test:test_module.html.twig', array('modulePath' => $modulePath));
    }

    public function testModuleRequireMainAction(Request $request)
    {
        $modulePath = $request->query->get('module');

        return $this->render('MaxplayerFrontendBundle:Test:requirejs_main_test_module.js.twig', array('modulePath' => $modulePath));
    }
}
