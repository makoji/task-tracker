/**
 * email format
 * @param {string} email - email to be validated
 * @returns {Object}       result  ^
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
 * check pw strength
 * @param {string} password - password to validate
 * @returns {Object}       result  ^
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

  
  return { isValid: true };

};

/**
 * user registration data
 * @param {Object} userData - user data
 * @returns {Object}       result  ^ of user data check
 */
export const validateUserRegistration = (userData) => {

  const { name, email, password } = userData;
  
  // check if a name has been provided
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  // min length is 2 char
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  // max length 50; ensures space in the DB isnt wasted with excessively long names
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  // check email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  
  // check password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }
  
  return { isValid: true };

};




/**
 * validate task data
 * @param {Object} taskData - task data to validate
 * @returns {Object} validation result
 */
export const validateTask = (taskData) => {

  const { title, description, category, priority, dueDate } = taskData;
  
  // check if title provided
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Task title is required' };
  }
  
  // max title lenght - keep it conscise; also helps w db space
  if (title.trim().length > 100) {
    return { isValid: false, error: 'Task title must be less than 100 characters' };
  }

  
  // check if category has been selected
  //     could benefit from this being optionsal?
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
 * validate task update data
 * @param {Object} updateData - task update data to validate
 * @returns {Object}  result
 */
export const validateTaskUpdate = (updateData) => {

  const { title, description, category, priority, dueDate, completed } = updateData;
  
  // if title is provided, validate it
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'Task title cannot be empty' };
    }
    
    if (title.trim().length > 100) {
      return { isValid: false, error: 'Task title must be less than 100 characters' };
    }
  }
  
  // if description is provided, validate it
  if (description !== undefined && description && description.length > 500) {
    return { isValid: false, error: 'Task description must be less than 500 characters' };
  }
  
  // if category is provided, validate it
  if (category !== undefined) {
    const validCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Finance'];
    if (!validCategories.includes(category)) {
      return { isValid: false, error: 'Please select a valid category' };
    }
  }
  
  // if priority is provided, validate it
  if (priority !== undefined) {
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(priority)) {
      return { isValid: false, error: 'Please select a valid priority' };
    }
  }
  
  // if due date is provided, validate it
  if (dueDate !== undefined && dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: 'Please enter a valid due date' };
    }
  }
  
  // if completed is provided, validate it
  if (completed !== undefined && typeof completed !== 'boolean') {
    return { isValid: false, error: 'Completed status must be true or false' };
  }
  
  return { isValid: true };

};




/**
 *   for sanitising input by removing characters indicative of a code injection
 * @param {string} input    the string that need 2 be sanitised
 * @returns {string}     cleaned :thumbsup:
 */
export const sanitizeString = (input) => {

  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // remove potential html tags
    .replace(/\s+/g, ' '); // remove extra spaces

};



/**
 *   validating mongodb objects
 * @param {string} id   <- object id  to check
 * @returns {boolean}   set as true if its a valid objectid
 */
export const isValidObjectId = (id) => {

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);

};



/**
 *    validating pagination parameters
 * @param {Object} params    <- the params in question
 * @returns {Object}     validated & sanitised
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