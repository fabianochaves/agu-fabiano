<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\DTO\LoginDTO;
use App\Entity\User;

class AuthService
{
    private $entityManager;
    private $JWTManager;
    private $passwordHasher;

    public function __construct(
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $JWTManager,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->entityManager = $entityManager;
        $this->JWTManager = $JWTManager;
        $this->passwordHasher = $passwordHasher;
    }

    public function login(LoginDTO $loginDTO): ?string
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $loginDTO->getUsername()]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $loginDTO->getPassword())) {
            return null;
        }

        return $this->JWTManager->create($user);
    }
}
