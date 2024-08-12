<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;

class CorsListener
{
    public function onKernelResponse(ResponseEvent $event)
    {
        $request = $event->getRequest();
        $response = $event->getResponse();
        
        // Verifica se a origem é permitida
        $allowedOrigin = 'http://localhost:4200';
        $origin = $request->headers->get('Origin');

        if ($origin === $allowedOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } else {
            // Optionally, you can set a different status code or message if the origin is not allowed
            $response->setStatusCode(403);
            $response->setContent('Origin not allowed');
            return;
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        if ($request->getMethod() === 'OPTIONS') {
            $response->setStatusCode(200);
        }
    }
}
