// @/repositories/PostgresProjectRepo.ts
import { pgPool } from '../lib/db';

export class PostgresProjectRepo {
  async createProject(title: string, description: string) {
    const res = await pgPool.query(
      `INSERT INTO projects (title, description) VALUES ($1, $2) RETURNING *`,
      [title, description]
    );
    return res.rows[0];
  }

  async addTaskToProject(projectId: string, title: string) {
    const res = await pgPool.query(
      `INSERT INTO tasks (project_id, title) VALUES ($1, $2) RETURNING *`,
      [projectId, title]
    );
    return res.rows[0];
  }

  // Uses JSON aggregation to return a single structured object mirroring the NoSQL output
  async getProjectWithTasks(projectId: string) {
    const res = await pgPool.query(`
      SELECT 
        p.*,
        COALESCE(
          json_agg(t.* ORDER BY t.created_at) FILTER (WHERE t.id IS NOT NULL), 
          '[]'
        ) as tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.id = $1
      GROUP BY p.id;
    `, [projectId]);
    return res.rows[0];
  }

  async updateTaskStatus(taskId: string, status: string) {
    const res = await pgPool.query(
      `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, taskId]
    );
    return res.rows[0];
  }

  async deleteProject(projectId: string) {
    // ON DELETE CASCADE automatically removes associated tasks
    await pgPool.query(`DELETE FROM projects WHERE id = $1`, [projectId]);
  }
}