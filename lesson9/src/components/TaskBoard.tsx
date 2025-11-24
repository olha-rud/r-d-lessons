import { TaskCard } from './TaskCard';
import type { Task, Status } from '../types/task.types';
import './TaskBoard.css';

type TaskBoardProps = {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
};

const COLUMNS: { status: Status; title: string; headerClass: string }[] = [
  { status: 'todo', title: 'TO DO', headerClass: 'column-header-todo' },
  { status: 'inProgress', title: 'IN PROGRESS', headerClass: 'column-header-inProgress' },
  { status: 'done', title: 'DONE', headerClass: 'column-header-done' },
];

export function TaskBoard({ tasks, onDeleteTask }: TaskBoardProps) {
  const getTasksByStatus = (status: Status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="board">
      {COLUMNS.map(({ status, title, headerClass }) => {
        const columnTasks = getTasksByStatus(status);
        
        return (
          <div key={status} className="column">
            <div className={`column-header ${headerClass}`}>
              <h2>{title}</h2>
              <span className="count">{columnTasks.length}</span>
            </div>
            <div className="column-content">
              {columnTasks.length === 0 ? (
                <div className="empty-column">No tasks</div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}