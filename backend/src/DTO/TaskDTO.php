<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class TaskDTO
{
    /**
     * @Assert\NotBlank()
     * @Assert\Length(max=255)
     */
    private $title;

    /**
     * @Assert\Length(max=1000)
     */
    private $description;

    public function __construct(string $title, ?string $description = null)
    {
        $this->title = $title;
        $this->description = $description;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }
}
