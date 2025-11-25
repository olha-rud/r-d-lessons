import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTask } from '../api';
import './CreateTaskForm.css';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: 'Deadline cannot be in the past' }
    ),
});

type TaskFormData = z.infer<typeof taskSchema>;

type CreateTaskFormProps = {
  onSuccess: () => void;
};

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      setSubmitError(null);
      const taskData = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      await createTask(taskData);
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      setSubmitError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Task</h2>
      {submitError && (
        <div className="submit-error" role="alert">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className={errors.title ? 'error' : ''}
            {...register('title')}
            placeholder="Enter task title"
          />
          {errors.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            placeholder="Add task description (optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select id="status" {...register('status')}>
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">
              Priority <span className="required">*</span>
            </label>
            <select id="priority" {...register('priority')}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            type="date"
            className={errors.deadline ? 'error' : ''}
            {...register('deadline')}
          />
          {errors.deadline && (
            <span className="error-message">{errors.deadline.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-submit" 
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}