<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\DTO\TaskDTO;
use App\DTO\DeleteTaskDTO;
use App\Entity\Task;
use Symfony\Component\Security\Core\User\UserInterface;

class TaskService
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getTasks(UserInterface $user)
    {
        return $this->entityManager->getRepository(Task::class)->findBy(['user' => $user]);
    }

    public function createTask(TaskDTO $taskDTO, UserInterface $user): Task
    {
        $task = new Task();
        $task->setUser($user);
        $task->setTitle($taskDTO->getTitle());
        $task->setDescription($taskDTO->getDescription());
        $task->setCreatedAt(new \DateTime());

        $this->entityManager->persist($task);
        $this->entityManager->flush();

        return $task;
    }

    public function updateTask(int $id, TaskDTO $taskDTO, UserInterface $user): ?Task
    {
        $task = $this->entityManager->getRepository(Task::class)->find($id);

        if (!$task) {
            throw new \Exception('Task not found');
        }

        if ($task->getUser() !== $user) {
            throw new \Exception('You do not have permission to update this task');
        }

        $task->setTitle($taskDTO->getTitle());
        $task->setDescription($taskDTO->getDescription());
        $task->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($task);
        $this->entityManager->flush();

        return $task;
    }

    public function deleteTask(DeleteTaskDTO $deleteTaskDTO, UserInterface $user): bool
    {
        $task = $this->entityManager->getRepository(Task::class)->find($deleteTaskDTO->getId());

        if (!$task || $task->getUser() !== $user) {
            return false;
        }

        $this->entityManager->remove($task);
        $this->entityManager->flush();

        return true;
    }
}