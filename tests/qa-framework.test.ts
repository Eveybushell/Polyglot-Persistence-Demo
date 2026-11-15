import 'dotenv/config';
import { PostgresProjectRepo } from '../repositories/PostgresProjectRepo';
import { MongoProjectRepo } from '../repositories/MongoProjectRepo';
import { pgPool, closeMongoDb } from '../lib/db';
import { describe, test, expect, afterAll } from '@jest/globals';

describe('Polyglot Persistence QA Framework', () => {
  const pgRepo = new PostgresProjectRepo();
  const mongoRepo = new MongoProjectRepo();

  afterAll(async () => {
    await pgPool.end();
    await closeMongoDb(); 
  });

  describe('1. Relational (SQL) CRUD & Integrity Tests', () => {
    let projectId: string;
    let taskId: string;

    test('Create & Read: Insert parent/child and retrieve full joined dataset', async () => {
      const project = await pgRepo.createProject('Integration Test SQL', 'Verifying joins');
      projectId = project.id;
      
      const task = await pgRepo.addTaskToProject(projectId, 'Verify 3NF Data');
      taskId = task.id;

      const fullProject = await pgRepo.getProjectWithTasks(projectId);
      
      expect(fullProject.id).toBe(projectId);
      expect(fullProject.tasks.length).toBe(1);
      expect(fullProject.tasks[0].id).toBe(taskId);
    });

    test('Update: Modify attribute and verify immediate read reflection', async () => {
      await pgRepo.updateTaskStatus(taskId, 'DONE');
      
      const fullProject = await pgRepo.getProjectWithTasks(projectId);
      expect(fullProject.tasks[0].status).toBe('DONE');
    });

    test('Negative Constraint Test: Reject orphaned record insert', async () => {
      const invalidUUID = '00000000-0000-0000-0000-000000000000';
      
      await expect(pgRepo.addTaskToProject(invalidUUID, 'Orphaned Task'))
        .rejects
        .toThrow(/foreign key constraint/i); // Validates database-level rejection
    });

    test('Delete & Cascade: Parent deletion automatically removes child records', async () => {
      await pgRepo.deleteProject(projectId);
      
      // Verify parent is gone
      const deletedProject = await pgRepo.getProjectWithTasks(projectId);
      expect(deletedProject).toBeUndefined();

      // Verify child is cascaded (bypassing repo abstraction for direct DB check)
      const taskCheck = await pgPool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
      expect(taskCheck.rows.length).toBe(0);
    });
  });

  describe('2. NoSQL CRUD & Document Tests', () => {
    let documentId: string;
    let embeddedTaskId: string;

    test('Create & Read: Single query retrieval without joins', async () => {
      const project = await mongoRepo.createProject('Integration Test NoSQL', 'Verifying embedding');
      documentId = project._id.toString();

      const task = await mongoRepo.addTaskToProject(documentId, 'Verify Document Array');
      embeddedTaskId = task._id.toString();

      const fullDocument = await mongoRepo.getProjectWithTasks(documentId);

      if (!fullDocument) {
        throw new Error('Project document was unexpectedly null in the database.');
        }
      
      expect(fullDocument._id.toString()).toBe(documentId);
      expect(fullDocument.tasks.length).toBe(1);
      expect(fullDocument.tasks[0]?.title).toBe('Verify Document Array');
    });

    test('Update: Atomic operation on embedded array element', async () => {
      await mongoRepo.updateTaskStatus(documentId, embeddedTaskId, 'IN_PROGRESS');
      
      const fullDocument = await mongoRepo.getProjectWithTasks(documentId);

      if (!fullDocument) {
        throw new Error('Project document was unexpectedly null in the database.');
        }
      expect(fullDocument.tasks[0]?.status).toBe('IN_PROGRESS');
    });

    test('Delete: Clean document removal', async () => {
      await mongoRepo.deleteProject(documentId);
      
      const deletedDocument = await mongoRepo.getProjectWithTasks(documentId);
      expect(deletedDocument).toBeNull();
    });
  });
});