<?php

namespace Glifery\VkOAuthTokenBundle;

use Glifery\VkOAuthTokenBundle\DependencyInjection\GliferyVkOAuthTokenExtension;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class GliferyVkOAuthTokenBundle extends Bundle
{
    public function getContainerExtension()
    {
        if (null === $this->extension) {
            $this->extension = new GliferyVkOAuthTokenExtension();
        }

        return $this->extension;
    }
}
