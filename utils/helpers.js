//date formattign
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // reset specific time, to get only dates
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  // compare the *Dates* specifically
  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'Tomorrow';
  } else if (dateOnly < todayOnly) {
    return 'Overdue';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

// checks if overdue
export const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // resets time to compare, like earlier
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return dateOnly < todayOnly;
};

// sorting tasks by priotity + due date
// ideally they'd display in category groups too, or in other groups determined by other tags a user could add?
export const sortTasks = (tasks) => {
  const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
  
  return [...tasks].sort((a, b) => {
    // sort by completion
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // sort by duedates
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    
    // default: (if*else*) - date task was added
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

// make sure the email format is correct
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// catgegory colors kept random for simplicity - ideally, the user could pick them instead
export const getCategoryColor = (category) => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-teal-100 text-teal-800',
    'bg-mint-100 text-mint-800',
    'bg-magenta-100 text-magenta-800'
  ];
  
  // keeping the colors consistent - once set they shouldnt change randomly
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// for the search function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};