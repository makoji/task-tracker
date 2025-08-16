import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Layout from '../components/layout';
import AuthForm from '../components/auth-form';
import TaskList from '../components/task-list';
import FilterBar from '../components/filter-bar';
import TaskStats from '../components/task-stats';
import TaskForm from '../components/task-form';
import { useTasks } from '../hooks/useTasks';

import { CheckCircle2, Plus, Flag, Filter } from 'lucide-react';


export default function Home() {
  const { data: session, status } = useSession();
  
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


  // log session changes
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);


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

  // show loading state
  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading...
        </div>
      </div>
    );
  }


  const isAuthenticated = status === 'authenticated' && session?.user;

  // landing page for not logged in user
  if (!isAuthenticated) {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <div className="landing-hero">
            <h1 className="landing-title">task buddy</h1>
            <p className="landing-subtitle">
              get a little help with keeping track of your daily life!
            </p>
            <button
              onClick={() => setShowAuthForm(true)}
              className="landing-cta"
            >
              Get Started
            </button>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <CheckCircle2 style={{ width: '3rem', height: '3rem', color: 'white', margin: '0 auto 15px' }} />
              <h3>task management...</h3>
              <p>create and edit your tasks easily...</p>
            </div>
            <div className="feature-card">
              <Flag style={{ width: '3rem', height: '3rem', color: 'white', margin: '0 auto 15px' }} />
              <h3>...with priorities...</h3>
              <p>mark which tasks are most important!</p>
            </div>
            <div className="feature-card">
              <Filter style={{ width: '3rem', height: '3rem', color: 'white', margin: '0 auto 15px' }} />
              <h3>...and filtering!</h3>
              <p>search by category or priority</p>
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
      <div className="main-content">
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
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 className="card-title">
            Your Tasks ({filteredTasks.length})
          </h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary"
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
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