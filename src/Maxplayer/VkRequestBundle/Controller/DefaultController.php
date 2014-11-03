<?php

namespace Maxplayer\VkRequestBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('MaxplayerVkRequestBundle:Default:index.html.twig', array('name' => $name));
    }
}
