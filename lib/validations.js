// Validation utilities for forms and API endpoints

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one letter and one number (optional - can be enabled)
  // const hasLetter = /[a-zA-Z]/.test(password);
  // const hasNumber = /\d/.test(password);
  // if (!hasLetter || !hasNumber) {
  //   return { isValid: false, error: 'Password must contain at least one letter and one number' };
  // }
  
  return { isValid: true };
};

/**
 * Validate user registration data
 * @param {Object} userData - User data to validate
 * @returns {Object} Validation result
 */
export const validateUserRegistration = (userData) => {
  const { name, email, password } = userData;
  
  // Validate name
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  
  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }
  
  return { isValid: true };
};

/**
 * Validate task data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} Validation result
 */
export const validateTask = (taskData) => {
  const { title, description, category, priority, dueDate } = taskData;
  
  // Validate title
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Task title is required' };
  }
  
  if (title.trim().length > 100) {
    return { isValid: false, error: 'Task title must be less than 100 characters' };
  }
  
  // Validate description (optional)
  if (description && description.length > 500) {
    return { isValid: false, error: 'Task description must be less than 500 characters' };
  }
  
  // Validate category
  const validCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Finance'];
  if (!category || !validCategories.includes(category)) {
    return { isValid: false, error: 'Please select a valid category' };
  }
  
  // Validate priority
  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (!priority || !validPriorities.includes(priority)) {
    return { isValid: false, error: 'Please select a valid priority' };
  }
  
  // Validate due date (optional)
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Please enter a valid due date' };
    }
  }
  
  return { isValid: true };
};

/**
 * Validate task update data
 * @param {Object} updateData - Task update data to validate
 * @returns {Object} Validation result
 */
export const validateTaskUpdate = (updateData) => {
  const { title, description, category, priority, dueDate, completed } = updateData;
  
  // If title is provided, validate it
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'Task title cannot be empty' };
    }
    
    if (title.trim().length > 100) {
      return { isValid: false, error: 'Task title must be less than 100 characters' };
    }
  }
  
  // If description is provided, validate it
  if (description !== undefined && description && description.length > 500) {
    return { isValid: false, error: 'Task description must be less than 500 characters' };
  }
  
  // If category is provided, validate it
  if (category !== undefined) {
    const validCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Finance'];
    if (!validCategories.includes(category)) {
      return { isValid: false, error: 'Please select a valid category' };
    }
  }
  
  // If priority is provided, validate it
  if (priority !== undefined) {
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(priority)) {
      return { isValid: false, error: 'Please select a valid priority' };
    }
  }
  
  // If due date is provided, validate it
  if (dueDate !== undefined && dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Please enter a valid due date' };
    }
  }
  
  // If completed is provided, validate it
  if (completed !== undefined && typeof completed !== 'boolean') {
    return { isValid: false, error: 'Completed status must be true or false' };
  }
  
  return { isValid: true };
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validation result with sanitized values
 */
export const validatePagination = (params) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
  
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return { isValid: false, error: 'Page must be a positive number' };
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return { isValid: false, error: 'Limit must be between 1 and 100' };
  }
  
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'];
  if (!validSortFields.includes(sortBy)) {
    return { isValid: false, error: 'Invalid sort field' };
  }
  
  const validSortOrders = ['asc', 'desc'];
  if (!validSortOrders.includes(sortOrder)) {
    return { isValid: false, error: 'Sort order must be asc or desc' };
  }
  
  return {
    isValid: true,
    data: {
      page: pageNum,
      limit: limitNum,
      sortBy,
      sortOrder,
      skip: (pageNum - 1) * limitNum
    }
  };
};