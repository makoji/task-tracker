import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext.js';
import { API_ENDPOINTS } from '../utils/constants.js';


export const useTasks = () => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get all tasks
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.tasks);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // add a new task
  const createTask = async (taskData) => {
    try {
      setError(null);
      
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
      
      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // update existing task
  const updateTask = async (id, updates) => {
    try {
      setError(null);
      
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
      
      setTasks(prev => prev.map(task => 
        task._id === id ? data : task
      ));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // marked as complete - toggling
  const toggleTask = async (id) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.taskById(id), {
        method: 'PATCH',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle task');
      }
      
      setTasks(prev => prev.map(task => 
        task._id === id ? data : task
      ));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // delete a task
  const deleteTask = async (id) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.taskById(id), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // filter (by category priority etc)
  const filterTasks = (filters) => {
    return tasks.filter(task => {
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

  // get task stats
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const urgent = tasks.filter(t => t.priority === 'Urgent' && !t.completed).length;
    
    return { total, completed, pending, urgent };
  };

  // load tasks when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    filterTasks,
    getTaskStats,
  };
};