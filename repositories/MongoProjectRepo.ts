// @/repositories/MongoProjectRepo.ts
import { getMongoDb } from '../lib/db';
import { ObjectId } from 'mongodb';

// 1. Define the shape of your embedded task
export interface MongoTask {
  _id: ObjectId;
  title: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// 2. Define the parent project, explicitly typing 'tasks' as an array
export interface MongoProject {
  _id?: ObjectId;
  title: string;
  description: string;
  tasks: MongoTask[];
  created_at: Date;
  updated_at: Date;
}

export class MongoProjectRepo {
  private async getCollection() {
    const db = await getMongoDb();
    return db.collection<MongoProject>('projects');
  }

  async createProject(title: string, description: string) {
    const collection = await this.getCollection();
    const doc = {
      title,
      description,
      tasks: [] as MongoTask[],
      created_at: new Date(),
      updated_at: new Date()
    };
    const res = await collection.insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }

  async addTaskToProject(projectId: string, title: string) {
    const collection = await this.getCollection();
    const newTask = {
      _id: new ObjectId(),
      title,
      status: 'TODO',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await collection.updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $push: { tasks: newTask },
        $set: { updated_at: new Date() }
      }
    );
    return newTask;
  }

  async getProjectWithTasks(projectId: string) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(projectId) });
  }

  async updateTaskStatus(projectId: string, taskId: string, status: string) {
    const collection = await this.getCollection();
    await collection.updateOne(
      { 
        _id: new ObjectId(projectId),
        "tasks._id": new ObjectId(taskId) 
      },
      { 
        $set: { 
          "tasks.$.status": status,
          "tasks.$.updated_at": new Date(),
          updated_at: new Date()
        } 
      }
    );
  }

  async deleteProject(projectId: string) {
    const collection = await this.getCollection();
    await collection.deleteOne({ _id: new ObjectId(projectId) });
  }
}