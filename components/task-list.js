import TaskItem from './task-item.js';

// the component loading the actual task lists 
// (or, placeholdering them if there's none))
export default function TaskList({ tasks, onToggleTask, onEditTask, onDeleteTask, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner mr-2" />
            <span className="text-gray-600">Loading tasks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="divide-y divide-gray-100">
        {tasks.length === 0 ? (
          <div className="empty-state">
            No tasks found. Create your first task to get started!
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onToggle={() => onToggleTask(task._id || task.id)}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task._id || task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}