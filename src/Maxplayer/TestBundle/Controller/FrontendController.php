<?php

namespace Maxplayer\TestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontendController extends Controller
{
    public function indexAction()
    {
        return $this->render('MaxplayerTestBundle:Frontend:index.html.twig');
    }
}
