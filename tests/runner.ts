// @/tests/runner.ts
import { PostgresProjectRepo } from '../repositories/PostgresProjectRepo';
import { MongoProjectRepo } from '../repositories/MongoProjectRepo';
import { pgPool } from '../lib/db';

async function runTests() {
  console.log('--- Starting Polyglot Persistence Test ---');

  // 1. Test Relational (PostgreSQL)
  console.log('\n[PostgreSQL] Initializing...');
  const pgRepo = new PostgresProjectRepo();
  
  const pgProject = await pgRepo.createProject('Backend Refactor', 'Migrate to clean architecture');
  console.log(`[PostgreSQL] Created Project ID: ${pgProject.id}`);
  
  const pgTask = await pgRepo.addTaskToProject(pgProject.id, 'Setup DI Container');
  await pgRepo.updateTaskStatus(pgTask.id, 'DONE');
  
  const fullPgProject = await pgRepo.getProjectWithTasks(pgProject.id);
  console.dir(fullPgProject, { depth: null });
  
  // await pgRepo.deleteProject(pgProject.id);
  // console.log('[PostgreSQL] Project and cascaded tasks deleted.');

  // 2. Test Non-Relational (MongoDB)
  console.log('\n[MongoDB] Initializing...');
  const mongoRepo = new MongoProjectRepo();
  
  const mongoProject = await mongoRepo.createProject('Frontend Overhaul', 'Implement new design system');
  console.log(`[MongoDB] Created Project ID: ${mongoProject._id}`);
  
  const mongoTask = await mongoRepo.addTaskToProject(mongoProject._id.toString(), 'Create Button Component');
  await mongoRepo.updateTaskStatus(mongoProject._id.toString(), mongoTask._id.toString(), 'IN_PROGRESS');
  
  const fullMongoProject = await mongoRepo.getProjectWithTasks(mongoProject._id.toString());
  console.dir(fullMongoProject, { depth: null });
  
  // await mongoRepo.deleteProject(mongoProject._id.toString());
  // console.log('[MongoDB] Document and embedded array deleted.');

  // Cleanup
  await pgPool.end();
  process.exit(0);
}

runTests().catch(console.error);