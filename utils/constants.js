// currently, the categories are pre-set: ideally, the user would be able to create their own categories
// they should also be able to colorcode them - or apply colored 'tags'? to make the app more visually clear

  // categories
export const TASK_CATEGORIES = [
  'Daily', 
  'Shopping',
  'Health',
  'School',
  'Work',
  'Finance',
  'Family',
  'Pets'  // pets feels a bit random if im trying to simulate realistic categories, but i did also just run out of ideas + wanted a lot of choice
          // potentially useful in a delegation scenario? ie if you could forward tasks (esp pre-scheduled/repeating ones - whole different thing though)
          // to another person. eg, if you have a friend dogsitting for you, you could set it up so for the duration you're away, they get a daily task to go on a walk with the dog
                // actually, the whole category based task delegation idea would be great for flatmates: you could set a specific category to be automatically set up for a specific person, but anyone can add tasks to it
                    // i am absolutely stealing this for at least the webcon project, this is pretty good actually 
            //  "delegating tasks"  what a bit of working with BPS does to a guy i guess. this is my personality now
];

// priority levels marked with !, similar to how emails marked 'urgent' display with an !
          //   ^  no longer doing that because i realised having the normal and low levels of priotity marked with !s anyway is not a great idea  (= terrible ux; makes them look urgent when they aren't)
          //      also, having FOUR exclamation marks for a single tag was not particularly readable either.
export const TASK_PRIORITIES = [
  'Low',
  'Normal',
  'High',
  'Urgent'
];

// adds colors to the priority levels - lot easier to understand visually
export const PRIORITY_COLORS = {
  'low': {
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200'
  },
  'normal': {
    text: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200'
  },
  'high': {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-200'
  },
  'urgent': {
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