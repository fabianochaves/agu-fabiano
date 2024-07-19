<?php

namespace App\Controller;

use App\DTO\TaskDTO;
use App\DTO\DeleteTaskDTO;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskController extends AbstractController
{
    private $entityManager;
    private $validator;

    public function __construct(EntityManagerInterface $entityManager, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    /**
     * @Route("/api/tasks", name="get_tasks", methods={"GET"})
     */
    public function getTasks(): JsonResponse
    {
        $user = $this->getUser();
        $tasks = $this->entityManager->getRepository(Task::class)->findBy(['user' => $user]);

        $taskArray = array_map(function (Task $task) {
            return [
                'id' => $task->getId(),
                'title' => $task->getTitle(),
                'description' => $task->getDescription(),
                'created_at' => $task->getCreatedAt()->format(\DateTime::ISO8601),
                'updated_at' => $task->getUpdatedAt()->format(\DateTime::ISO8601),
            ];
        }, $tasks);

        return new JsonResponse($taskArray);
    }

    /**
     * @Route("/api/tasks", name="create_task", methods={"POST"})
     */
    public function createTask(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $taskDTO = new TaskDTO($data['title'], $data['description']);

        // Validação
        $errors = $this->validator->validate($taskDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $task = new Task();
        $task->setUser($this->getUser());
        $task->setTitle($taskDTO->getTitle());
        $task->setDescription($taskDTO->getDescription());
        $task->setCreatedAt(new \DateTime());
        $task->setUpdatedAt(new \DateTime()); // Atualiza a data de modificação

        try {
            $this->entityManager->persist($task);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'Task created successfully', 'task' => $task->getId()], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to create task', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * @Route("/api/tasks/{id}", name="update_task", methods={"PUT"})
     */
    public function updateTask($id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $taskDTO = new TaskDTO($data['title'], $data['description']);

        $errors = $this->validator->validate($taskDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $task = $this->entityManager->getRepository(Task::class)->find($id);

        if (!$task || $task->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Task not found or not authorized'], 404);
        }

        $task->setTitle($taskDTO->getTitle());
        $task->setDescription($taskDTO->getDescription());
        $task->setUpdatedAt(new \DateTime());

        try {
            $this->entityManager->persist($task);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'Task updated successfully', 'task' => $task->getId()], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to update task', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * @Route("/api/tasks/{id}", name="delete_task", methods={"DELETE"})
     */
    public function deleteTask($id): JsonResponse
    {
        // Valida o ID da tarefa
        $deleteTaskDTO = new DeleteTaskDTO($id);
        $errors = $this->validator->validate($deleteTaskDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $task = $this->entityManager->getRepository(Task::class)->find($id);

        if (!$task || $task->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Task not found or not authorized'], 404);
        }

        try {
            $this->entityManager->remove($task);
            $this->entityManager->flush();

            return new JsonResponse(['status' => 'Task deleted successfully', 'task' => $task->getId()], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to delete task', 'message' => $e->getMessage()], 500);
        }
    }
}
