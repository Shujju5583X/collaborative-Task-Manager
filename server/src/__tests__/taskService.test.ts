import { taskService } from '../services/taskService';
import { taskRepository } from '../repositories/taskRepository';
import { userRepository } from '../repositories/userRepository';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { Status, Priority } from '@prisma/client';

// Mock the repositories
jest.mock('../repositories/taskRepository');
jest.mock('../repositories/userRepository');

const mockTaskRepository = taskRepository as jest.Mocked<typeof taskRepository>;
const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;

describe('TaskService', () => {
    // Sample test data
    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
    };

    const mockTask = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        status: Status.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-123',
        assignedToId: 'user-456',
        createdBy: mockUser,
        assignedTo: { ...mockUser, id: 'user-456', name: 'Assignee User' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== TEST 1: Create Task ====================
    describe('createTask', () => {
        it('should create a task successfully when assignee exists', async () => {
            // Arrange
            const createInput = {
                title: 'New Task',
                description: 'New Description',
                priority: Priority.HIGH,
                assignedToId: 'user-456',
            };
            const creatorId = 'user-123';

            mockUserRepository.findByIdPublic.mockResolvedValue({
                id: 'user-456',
                email: 'assignee@example.com',
                name: 'Assignee',
                createdAt: new Date(),
            });

            mockTaskRepository.create.mockResolvedValue({
                ...mockTask,
                ...createInput,
                createdById: creatorId,
            });

            // Act
            const result = await taskService.createTask(createInput, creatorId);

            // Assert
            expect(mockUserRepository.findByIdPublic).toHaveBeenCalledWith('user-456');
            expect(mockTaskRepository.create).toHaveBeenCalledWith({
                ...createInput,
                createdById: creatorId,
            });
            expect(result.title).toBe('New Task');
            expect(result.priority).toBe(Priority.HIGH);
        });

        it('should throw BadRequestError when assignee does not exist', async () => {
            // Arrange
            const createInput = {
                title: 'New Task',
                assignedToId: 'non-existent-user',
            };

            mockUserRepository.findByIdPublic.mockResolvedValue(null);

            // Act & Assert
            await expect(taskService.createTask(createInput, 'user-123')).rejects.toThrow(BadRequestError);
            await expect(taskService.createTask(createInput, 'user-123')).rejects.toThrow('Assigned user not found');
        });
    });

    // ==================== TEST 2: Update Task ====================
    describe('updateTask', () => {
        it('should update a task when user is the creator', async () => {
            // Arrange
            const updateInput = {
                title: 'Updated Title',
                status: Status.IN_PROGRESS,
            };
            const userId = 'user-123'; // Same as createdById in mockTask

            mockTaskRepository.findById.mockResolvedValue(mockTask);
            mockTaskRepository.update.mockResolvedValue({
                ...mockTask,
                ...updateInput,
            });

            // Act
            const result = await taskService.updateTask('task-123', updateInput, userId);

            // Assert
            expect(mockTaskRepository.findById).toHaveBeenCalledWith('task-123');
            expect(mockTaskRepository.update).toHaveBeenCalledWith('task-123', updateInput);
            expect(result.task.title).toBe('Updated Title');
            expect(result.task.status).toBe(Status.IN_PROGRESS);
        });

        it('should throw NotFoundError when task does not exist', async () => {
            // Arrange
            mockTaskRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(
                taskService.updateTask('non-existent', { title: 'Test' }, 'user-123')
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw ForbiddenError when user is not creator or assignee', async () => {
            // Arrange
            mockTaskRepository.findById.mockResolvedValue(mockTask);

            // Act & Assert
            await expect(
                taskService.updateTask('task-123', { title: 'Test' }, 'unauthorized-user')
            ).rejects.toThrow(ForbiddenError);
        });
    });

    // ==================== TEST 3: Delete Task ====================
    describe('deleteTask', () => {
        it('should delete a task when user is the creator', async () => {
            // Arrange
            const userId = 'user-123'; // Same as createdById in mockTask

            mockTaskRepository.findById.mockResolvedValue(mockTask);
            mockTaskRepository.delete.mockResolvedValue(mockTask);

            // Act
            await taskService.deleteTask('task-123', userId);

            // Assert
            expect(mockTaskRepository.findById).toHaveBeenCalledWith('task-123');
            expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-123');
        });

        it('should throw NotFoundError when task does not exist', async () => {
            // Arrange
            mockTaskRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(taskService.deleteTask('non-existent', 'user-123')).rejects.toThrow(NotFoundError);
        });

        it('should throw ForbiddenError when user is not the creator', async () => {
            // Arrange
            mockTaskRepository.findById.mockResolvedValue(mockTask);

            // Act & Assert - trying to delete as assignee (not creator)
            await expect(taskService.deleteTask('task-123', 'user-456')).rejects.toThrow(ForbiddenError);
            await expect(taskService.deleteTask('task-123', 'user-456')).rejects.toThrow(
                'You do not have permission to delete this task'
            );
        });
    });
});
