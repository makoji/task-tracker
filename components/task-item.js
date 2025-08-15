import { CheckCircle2, Edit3, Trash2, Calendar } from 'lucide-react';

import { PRIORITY_COLORS } from '../utils/constants.js';
import { formatDate } from '../utils/helpers.js';


// priority can be marked with colors -- ease of use, potential accessibility benefits?
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const priorityStyles = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS['Medium'];

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-main">
          <button
            onClick={onToggle}
            className={`task-checkbox ${task.completed ? 'completed' : 'pending'}`}
          >
            {task.completed && <CheckCircle2 className="w-3 h-3" />}
          </button>
          
          <div className="task-details">
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`task-description ${task.completed ? 'completed' : ''}`}>
                {task.description}
              </p>
            )}
            
            <div className="task-meta">
              <span className="tag tag-category">
                {task.category}
              </span>
              
              <span className={`tag tag-priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <div className="date-display">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="task-actions">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}