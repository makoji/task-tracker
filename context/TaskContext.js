import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from '../utils/constants';

const TaskContext = createContext();

// Task reducer for complex state management
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        error: null 
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        error: null
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        error: null
      };
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        error: null
      };
    
    case 'CLEAR_TASKS':
      return { ...state, tasks: [], error: null };
    
    default:
      return state;
  }
};

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    priority: 'all',
    status: 'all',
    search: ''
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch all tasks
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch(API_ENDPOINTS.tasks);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      
      dispatch({ type: 'SET_TASKS', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new task
  const createTask = async (taskData) => {
    try {
      const response = await fetch(API_ENDPOINTS.tasks, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
      }
      
      dispatch({ type: 'ADD_TASK', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Update a task
  const updateTask = async (id, updates) => {
    try {
      const response = await fetch(API_ENDPOINTS.taskById(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
      }
      
      dispatch({ type: 'UPDATE_TASK', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.taskById(id), {
        method: 'PATCH',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle task');
      }
      
      dispatch({ type: 'TOGGLE_TASK', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.taskById(id), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Filter tasks
  const filterTasks = (filters) => {
    return state.tasks.filter(task => {
      const matchesCategory = filters.category === 'all' || task.category === filters.category;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && task.completed) ||
        (filters.status === 'pending' && !task.completed);
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
    });
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const urgent = state.tasks.filter(t => t.priority === 'Urgent' && !t.completed).length;
    const overdue = state.tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    
    return { total, completed, pending, urgent, overdue };
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Load tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      dispatch({ type: 'CLEAR_TASKS' });
    }
  }, [isAuthenticated]);

  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    filterTasks,
    getTaskStats,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};