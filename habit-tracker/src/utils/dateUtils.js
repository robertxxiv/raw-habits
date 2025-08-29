/**
 * Get array of dates for the last n days
 * @param {number} n - Number of days
 * @returns {Array} Array of date strings in YYYY-MM-DD format
 */
export const getLastNDays = (n) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(formatDate(d));
  }
  return result;
};

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getToday = () => {
  return formatDate(new Date());
};

/**
 * Get month name from date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Month name
 */
export const getMonthName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Get dates for calendar heatmap (last 12 weeks)
 * @returns {Array} Array of date objects for the last 12 weeks
 */
export const getCalendarDates = () => {
  const today = new Date();
  const dates = [];
  
  // Go back 84 days (12 weeks)
  for (let i = 0; i < 84; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push({
      date: formatDate(date),
      dayOfWeek: date.getDay(),
      weekOffset: Math.floor(i / 7),
    });
  }
  
  return dates.reverse();
};

/**
 * Group calendar dates by week
 * @param {Array} dates - Array of date objects
 * @returns {Array} Array of weeks, each containing date objects
 */
export const groupByWeek = (dates) => {
  const weeks = [];
  let currentWeek = [];
  
  for (const date of dates) {
    if (date.dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(date);
    if (date === dates[dates.length - 1]) {
      weeks.push(currentWeek);
    }
  }
  
  return weeks;
};