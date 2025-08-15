/**
 * Format a date string for display
 * @param {string|Date} dateString    <-    date in question
 * @param {string} format  <- allow one of the four ""types"" establised like 10 lines down ('short', 'long', 'relative', 'time')
 * @returns {string}   <- the adte in that format, as a string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // check if that date is even valid in the first place, immediately returns an error if not
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
 *    frame the date as relative to the current time - compare with existing date
 * @param {Date} date   <-    date in question
 * @returns {string}  string describing that relationship? time difference?
 */
export const getRelativeTimeString = (date) => {

  const now = new Date();
  const diffInSeconds = Math.floor((date - now) / 1000);
  const absDiff = Math.abs(diffInSeconds);
  
  const units = [   // clarifying the units so they're
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
      return `${interval} ${unit.name}${plural} ${suffix}`;   // english grammar being simple enough to just use -s suffix for plural nouns helps a lot here
      // doing this in polish would be so long. half a file of case statements long, probably
    }
  }
  
  return 'just now'; // if the date is equal to current time, just say now for simplicity. better than returning an empty string; clarifies to the user that its not broken, just THAT recent
  // presumably they'd know for their own tasks   - but if i were to later rework this to let a group of people work on theri tasks together/in one list, this would be a small but nice detail
  // ^ writing down in part just to remember that later

};




/**
 * is the date we're looking at Today's date   ?
 * @param {string|Date} dateString    <-    date in question
 * @returns {boolean}     <- is set to true if it  IS  today
 */
export const isToday = (dateString) => {

  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();  // default value of Date() is today's date
  return date.toDateString() === today.toDateString();   // so the comparison is very simple 

};



/**
 * is date  TOMORROW
 * @param {string|Date} dateString   <-    date in question
 * @returns {boolean}     <- sets to true if it IS tomorrow
 */
export const isTomorrow = (dateString) => {

  if (!dateString) return false;
  
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);  // similar to webcon; date and hour info can be updated by just going + or - the amount of [hours/days/etc] you want to change it by
  // (in retrospect, not surprising since webcon does run on JS. and hopes and dreams really. but spending twenty minutes looking for that function did stick sooo its helpful?)
  
  return date.toDateString() === tomorrow.toDateString();

};



/**
 * is date YESTERDAY
 * @param {string|Date} dateString        <-    date in question
 * @returns {boolean}      <- true if date is ysterday you get the drill by now
 */
export const isYesterday = (dateString) => {

  if (!dateString) return false;
  
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);  // same as the TOMORORW comparison; just moves the date back by one (1) 
  
  return date.toDateString() === yesterday.toDateString();

};



/**
 *    simple but useful;    checks if the date is OVERDUE
 * @param {string|Date} dateString    <-    date in question, as per usual
 * @returns {boolean}    <- true if date is past today
 */
export const isOverdue = (dateString) => {

  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // reset time to ONLY look at the dates, not hour data
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return dateOnly < todayOnly;   // simple comparison but it works  (hopefully )

};



/**
 *   checks if the date is SOON   (within the next three days)
 *        // ideally, you could edit your own personal settings - or maybe organisation wise ones  ? - to change what is considered soon. 
 * //     variable updateable via a different process and recalled(? that is NOT the correct word is it) here?
 * 
 * @param {string|Date} dateString    <-    date in question  
 * @returns {boolean}    <- true if the date is within that specified range
 */
export const isDueSoon = (dateString) => {

  if (!dateString) return false;
  
  const date = new Date(dateString);
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);  // sets up a three-days-from-now variable to let us compare this
  
  return date <= threeDaysFromNow && !isOverdue(dateString);  // check if its within less than 3 days AND its not already overdue

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
 *     formating the date for html input yippie   [type="date"]
 * @param {string|Date} dateString    <-    date in question
 * @returns {string}    <- returns as a string, using a YYYY-MM-DD 
 */
export const formatDateForInput = (dateString) => {

  if (!dateString) return '';
  
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '';

  return date.toISOString().split('T')[0];   // ISO date format beloved

};



/**
 *   return the start of a day for the date we're checking
 * @param {string|Date} dateString   <- that that date
 * @returns {Date}    what the date is at the exact start of the day ( =  00:00:00)
 */
export const getStartOfDay = (dateString) => {

  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());

};



/**
 *    show when the end of the provided date is, ie the specific hour mine etc
 * @param {string|Date} dateString -    <-    date in question
 * @returns {Date}    the date at very end of day (here being 23:59:59 exactly)
 */
export const getEndOfDay = (dateString) => {

  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

};



/**
 *    add dates to a provided date; ie return a new date based on the one inputted(? grammar) - if you want something for 5 days from now, etc
 * @param {string|Date} dateString   <- the date we're startinf from 
 * @param {number} days   <- number of days we're 'moving' it by; negative number would mean a date that's already passed / [x] days ago
 * @returns {Date}   new date
 */
export const addDays = (dateString, days) => {

  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;

};



/**
 * days remaining till the date  - for deadlines etc
 * @param {string|Date} dateString   <- date
 * @returns {number}  number of days remaining; will be negative if the date has already passed (same as right above ^ )
 */
export const getDaysUntil = (dateString) => {

  if (!dateString) return null;
  
  const date = getStartOfDay(dateString);
  const today = getStartOfDay(new Date());
  
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));

};



/**
 * check if in specified (via the objects) date range
 * @param {string|Date} dateString - the date we're comparing
 * @param {string|Date} startDate -       vs the start of the range
 * @param {string|Date} endDate -         and the end of the range
 * @returns {boolean}    <-  gets set to true if date IS in that range
 */
export const isDateInRange = (dateString, startDate, endDate) => {

  if (!dateString || !startDate || !endDate) return false;
  
  const date = new Date(dateString);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return date >= start && date <= end;

};



/**
 * current week's date range
 * @returns {Object}  <- contains start and end dates of the current week
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
 * current month's date range
 * @returns {Object}       <-  start and end dates of current month
 */
export const getCurrentMonthRange = () => {

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return { start, end };

};
// vsc add a built in function to lmk how much of a file is just my comments please. i want to know