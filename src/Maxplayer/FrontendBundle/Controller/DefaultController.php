<?php

namespace Maxplayer\FrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('MaxplayerFrontendBundle:Default:index.html.twig');
    }
}
