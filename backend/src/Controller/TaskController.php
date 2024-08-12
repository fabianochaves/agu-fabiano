<?php

namespace App\Controller;

use App\DTO\TaskDTO;
use App\DTO\DeleteTaskDTO;
use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends AbstractController
{
    private $entityManager;
    private $taskService;
    private $validator;

    public function __construct(EntityManagerInterface $entityManager, TaskService $taskService, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->taskService = $taskService;
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

        $errors = $this->validator->validate($taskDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $task = $this->taskService->createTask($taskDTO, $this->getUser());
            return new JsonResponse(['message' => 'Task created successfully', 'task' => $task->getId()], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to create task: ' . $e->getMessage()], Response::HTTP_CONFLICT);
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

        try {
            $task = $this->taskService->updateTask($id, $taskDTO, $this->getUser());
    
            if (!$task) {
                return new JsonResponse(['error' => 'Task could not be updated'], Response::HTTP_CONFLICT);
            }
    
            return new JsonResponse(['message' => 'Task updated successfully', 'task' => $task->getId()], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to update task: ' . $e->getMessage()], Response::HTTP_CONFLICT);
        }

    }

    /**
     * @Route("/api/tasks/{id}", name="delete_task", methods={"DELETE"})
     */
    public function deleteTask($id): JsonResponse
    {

        $deleteTaskDTO = new DeleteTaskDTO($id);
        $errors = $this->validator->validate($deleteTaskDTO);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }


        try {
            $task = $this->taskService->deleteTask($deleteTaskDTO, $this->getUser());
    
            if (!$task) {
                return new JsonResponse(['error' => 'Task could not be deleted'], Response::HTTP_CONFLICT);
            }
    
            return new JsonResponse(['message' => 'Task deleted successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to delete task: ' . $e->getMessage()], Response::HTTP_CONFLICT);
        }
    }
}
