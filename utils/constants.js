// currently, the categories are pre-set: ideally, the user would be able to create their own categories
// they should also be able to colorcode them - or apply colored 'tags'? to make the app more visually clear

  // categories
export const TASK_CATEGORIES = [
  'daily', 
  'shopping',
  'health',
  'school',
  'work',
  'finance',
  'family',
  'pets'
];

// priority levels marked with !, similar to how emails marked 'urgent' display with an !
export const TASK_PRIORITIES = [
  '!',
  '!!',
  '!!!',
  '!!!!'
];

// adds colors to the priority levels - lot easier to understand visually
export const PRIORITY_COLORS = {
  '!': {
    text: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200'
  },
  '!!': {
    text: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200'
  },
  '!!!': {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-200'
  },
  '!!!': {
    text: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200'
  }
};

// things you could filter by - because there arent that many tags right now, filtering by anything is suitable
export const FILTER_OPTIONS = {
  categories: ['all', ...TASK_CATEGORIES],
  priorities: ['all', ...TASK_PRIORITIES],
  statuses: [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]
};

// api
export const API_ENDPOINTS = {
  tasks: '/api/tasks',
  taskById: (id) => `/api/tasks/${id}`,
  register: '/api/auth/register'
};