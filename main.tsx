import { createRoot } from 'react-dom/client';
import ProjectDashboard from './components/ProjectDashboard';

const demoProject = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Polyglot Architecture Demo",
  description: "Live QA demonstration of relational vs document models.",
  tasks: []
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<ProjectDashboard project={demoProject} />);
}