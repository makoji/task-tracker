import { useState } from 'react';

import { useAuth } from '../context/AuthContext.js';
import Layout from '../../components/layout.js';
import AuthForm from '../../components/auth-form.js';
import TaskList from '../../components/task-list.js';
import FilterBar from '../../components/filter-bar.js';
import TaskStats from '../../components/task-stats.js';
import TaskForm from '../../components/task-form.js';
import { useTasks } from '../../hooks/use-tasks.js';

import { CheckCircle2, Plus, Flag, Filter } from 'lucide-react';



export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { tasks, loading, error, createTask, updateTask, toggleTask, deleteTask, filterTasks, getTaskStats } = useTasks();
  
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    search: ''
  });

  const filteredTasks = filterTasks(filters);
  const stats = getTaskStats();

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask._id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // home page if not logged in 
  if (!isAuthenticated) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-hero">

            <h1 className="landing-title">task buddy</h1>
            <p className="landing-subtitle">get a little help with keeping track of your daily life!</p>

            <button
              onClick={() => setShowAuthForm(true)}
              className="landing-cta"
            >
              try it out!
            </button>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <CheckCircle2 className="feature-icon" />
              <h3 className="feature-title">task management...</h3>
              <p className="feature-description">create and edit your tasks easily</p>
            </div>
            <div className="feature-card">
              <Flag className="feature-icon" />
              <h3 className="feature-title">...with priorities...</h3>
              <p className="feature-description">mark which tasks are most important!</p>
            </div>
            <div className="feature-card">
              <Filter className="feature-icon" />
              <h3 className="feature-title">...and filtering!</h3>
              <p className="feature-description">search by category or priority</p>
            </div>
          </div>
        </div>
        
        {showAuthForm && (
          <AuthForm onClose={() => setShowAuthForm(false)} />
        )}
      </div>
    );
  }

  // actual main interface
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <FilterBar 
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <TaskStats stats={stats} />
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title">
            Your Tasks ({filteredTasks.length})
          </h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary"
          >
            <Plus className="btn-icon" />
            <span>New Task</span>
          </button>
        </div>
        
        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          loading={loading}
        />
        
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
        
      </div>
    </Layout>
  );
}