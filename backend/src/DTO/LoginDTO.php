<?php

// src/DTO/LoginDTO.php
namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class LoginDTO
{
    /**
     * @Assert\NotBlank()
     * @Assert\Type("string")
     */
    private $username;

    /**
     * @Assert\NotBlank()
     * @Assert\Type("string")
     */
    private $password;

    public function __construct(string $username, string $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
