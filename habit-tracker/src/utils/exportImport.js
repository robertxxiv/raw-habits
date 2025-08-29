/**
 * Export habit data to a JSON file
 * @param {Array} habits - Array of habit objects
 */
export const exportHabits = (habits) => {
  const data = JSON.stringify(habits, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger click
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Import habit data from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise} Promise that resolves to the parsed habit data
 */
export const importHabits = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const habits = JSON.parse(event.target.result);
        
        // Basic validation to make sure it's habit data
        if (!Array.isArray(habits)) {
          throw new Error('Invalid habit data format. Expected an array.');
        }
        
        // Check if it has the required properties
        habits.forEach(habit => {
          if (!habit.id || !habit.name || !Array.isArray(habit.entries)) {
            throw new Error('Invalid habit data format. Missing required properties.');
          }
        });
        
        resolve(habits);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};