<?php

namespace App\Controller;

use App\DTO\LoginDTO;
use App\DTO\RegisterDTO;
use App\Service\AuthService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends AbstractController
{
    private $authService;
    private $userService;
    private $validator;

    public function __construct(AuthService $authService, UserService $userService, ValidatorInterface $validator)
    {
        $this->authService = $authService;
        $this->userService = $userService;
        $this->validator = $validator;
    }

    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $loginDTO = new LoginDTO($data['username'], $data['password']);

        $errors = $this->validator->validate($loginDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $token = $this->authService->login($loginDTO);
        if (!$token) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        return new JsonResponse(['token' => $token]);
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $registerDTO = new RegisterDTO($data['username'], $data['password']);

        $errors = $this->validator->validate($registerDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $success = $this->userService->register($registerDTO);
        
        if (!$success) {
            return new JsonResponse(['error' => 'Username already exists'], Response::HTTP_CONFLICT);
        }

        return new JsonResponse(['status' => 'User created'], 201);
    }
}
