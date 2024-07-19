<?php

// src/Service/UserService.php
namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\DTO\RegisterDTO;
use App\Entity\User;

class UserService
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    public function register(RegisterDTO $registerDTO): bool
    {
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $registerDTO->getUsername()]);
        if ($existingUser) {
            return false;
        }

        $user = new User();
        $user->setUsername($registerDTO->getUsername());
        $user->setPassword($this->passwordHasher->hashPassword($user, $registerDTO->getPassword()));
        $user->setCreatedAt(new \DateTime());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return true;
    }
}
