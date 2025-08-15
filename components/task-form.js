
import { useState } from 'react';
import { TASK_CATEGORIES, TASK_PRIORITIES } from '../utils/constants.js';

export default function TaskForm({ task, onSubmit, onClose }) {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      category: 'Personal',
      priority: 'Medium',
      dueDate: ''
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter task description (optional)"
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                {TASK_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                {TASK_PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="form-label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading && <div className="loading-spinner" />}
            <span>{loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}</span>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="modal-close"
        >
          ×
        </button>
      </div>
    </div>
  );
}