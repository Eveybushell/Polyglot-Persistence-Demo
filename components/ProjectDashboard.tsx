// @/components/ProjectDashboard.tsx
import React, { useState } from 'react';

type Task = { id: string; title: string; status: string };
type Project = { id: string; title: string; description: string; tasks: Task[] };

export default function ProjectDashboard({ project }: { project: Project }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) return; // UI Validation: Handles empty/whitespace inputs
    
    // Trigger backend API...
    setNewTaskTitle('');
  };

  return (
    // Mobile-first container: stacks on small screens, expands max-width on desktop
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Project Header - handles long strings without clipping */}
      <header className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
          {project.title}
        </h1>
        <p className="mt-2 text-gray-600 break-words">
          {project.description}
        </p>
      </header>

      {/* Task Creation Form */}
      <form 
        onSubmit={handleAddTask} 
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task description..."
          required
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Task
        </button>
      </form>

      {/* Responsive Data Table / List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Task</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 w-32">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700 w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {project.tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  {/* break-words ensures long continuous strings wrap instead of breaking the table layout */}
                  <td className="px-6 py-4 text-sm text-gray-900 break-words max-w-xs sm:max-w-md">
                    {task.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${task.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {project.tasks.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No tasks found. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}