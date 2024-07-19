<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class DeleteTaskDTO
{
    /**
     * @Assert\NotBlank()
     * @Assert\Type("integer")
     */
    private $id;

    public function __construct(int $id)
    {
        $this->id = $id;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
