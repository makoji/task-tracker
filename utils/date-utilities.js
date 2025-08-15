// Date formatting and manipulation utilities

/**
 * Format a date string for display
 * @param {string|Date} dateString - The date to format
 * @param {string} format - The format type ('short', 'long', 'relative', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'relative':
      return getRelativeTimeString(date);
    
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    
    case 'datetime':
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {Date} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((date - now) / 1000);
  const absDiff = Math.abs(diffInSeconds);
  
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
  ];
  
  for (const unit of units) {
    const interval = Math.floor(absDiff / unit.seconds);
    if (interval >= 1) {
      const suffix = diffInSeconds < 0 ? 'ago' : 'from now';
      const plural = interval > 1 ? 's' : '';
      return `${interval} ${unit.name}${plural} ${suffix}`;
    }
  }
  
  return 'just now';
};

/**
 * Check if a date is today
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is tomorrow
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is tomorrow
 */
export const isTomorrow = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return date.toDateString() === tomorrow.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export const isYesterday = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.toDateString() === yesterday.toDateString();
};

/**
 * Check if a date is overdue (past today)
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is overdue
 */
export const isOverdue = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Reset time to compare dates only
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  return dateOnly < todayOnly;
};

/**
 * Check if a date is due soon (within next 3 days)
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} True if the date is due soon
 */
export const isDueSoon = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  return date <= threeDaysFromNow && !isOverdue(dateString);
};

/**
 * Get a human-readable due date status
 * @param {string|Date} dateString - The date to check
 * @returns {string} Status string ('overdue', 'today', 'tomorrow', 'due-soon', 'future')
 */
export const getDueDateStatus = (dateString) => {
  if (!dateString) return 'no-date';
  
  if (isOverdue(dateString)) return 'overdue';
  if (isToday(dateString)) return 'today';
  if (isTomorrow(dateString)) return 'tomorrow';
  if (isDueSoon(dateString)) return 'due-soon';
  return 'future';
};

/**
 * Format date for HTML input[type="date"]
 * @param {string|Date} dateString - The date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

/**
 * Get the start of day for a date
 * @param {string|Date} dateString - The date
 * @returns {Date} Date at start of day (00:00:00)
 */
export const getStartOfDay = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Get the end of day for a date
 * @param {string|Date} dateString - The date
 * @returns {Date} Date at end of day (23:59:59)
 */
export const getEndOfDay = (dateString) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};

/**
 * Add days to a date
 * @param {string|Date} dateString - The starting date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date with days added
 */
export const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Get days until a date
 * @param {string|Date} dateString - The target date
 * @returns {number} Number of days until the date (negative if past)
 */
export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  
  const date = getStartOfDay(dateString);
  const today = getStartOfDay(new Date());
  
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is within a date range
 * @param {string|Date} dateString - The date to check
 * @param {string|Date} startDate - Range start date
 * @param {string|Date} endDate - Range end date
 * @returns {boolean} True if date is within range
 */
export const isDateInRange = (dateString, startDate, endDate) => {
  if (!dateString || !startDate || !endDate) return false;
  
  const date = new Date(dateString);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return date >= start && date <= end;
};

/**
 * Get the current week's date range
 * @returns {Object} Object with start and end dates of current week
 */
export const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return { start, end };
};

/**
 * Get the current month's date range
 * @returns {Object} Object with start and end dates of current month
 */
export const getCurrentMonthRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return { start, end };
};