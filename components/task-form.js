import { useState } from 'react';

export default function TaskForm({ task, onSubmit, onClose }) {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      category: 'Daily',
      priority: 'Normal',
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

    // debug - logs what's being sent rn
    console.log(' Sending task data:', formData);

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(' Task creation error:', err);
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Daily">Daily</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="School">School</option>
                <option value="Finance">Finance</option>
                <option value="Family">Family</option>
              </select>
              {/* show current value  (debugging)
              <small style={{ color: '#666', fontSize: '12px' }}>
                Current: "{formData.category}"
              </small>*/}
            </div>
            
            <div>
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {/* show current value (debugging)
              <small style={{ color: '#666', fontSize: '12px' }}>
                Current: "{formData.priority}"
              </small>*/}
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
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="modal-close"
        >
        
        </button>
      </div>
    </div>
  );
}