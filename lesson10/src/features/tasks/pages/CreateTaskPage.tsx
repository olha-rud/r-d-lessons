import { useNavigate } from 'react-router-dom';
import { CreateTaskForm } from '../components/CreateTaskForm';
import './CreateTaskPage.css';

export function CreateTaskPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/tasks');
  };

  return (
    <div className="create-task-page">
      <button className="btn-back" onClick={() => navigate('/tasks')}>
        ← Back to Tasks
      </button>
      
      <CreateTaskForm onSuccess={handleSuccess} />
    </div>
  );
}