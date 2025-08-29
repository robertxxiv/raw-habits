import { useHabits } from '../contexts/HabitContext';

const HabitItem = ({ habit, onEdit, onView, today }) => {
  const { trackHabit, calculateStreak } = useHabits();
  
  // Check if habit is completed for today
  const isCompletedToday = habit.entries.some(
    (entry) => entry.date === today && entry.value
  );
  
  // Get streak information
  const { current: currentStreak } = calculateStreak(habit.id);
  
  const handleToggle = () => {
    trackHabit(habit.id, today, !isCompletedToday);
  };
  
  return (
    <div className="habit-item">
      <div className="habit-header" style={{ backgroundColor: habit.color }}>
        <div className="habit-icon">{habit.icon}</div>
        <h3 className="habit-name" onClick={onView}>{habit.name}</h3>
        <button className="btn-edit" onClick={onEdit}>
          Edit
        </button>
      </div>
      
      <div className="habit-info">
        <div className="habit-streak">
          <span className="streak-count">{currentStreak}</span>
          <span className="streak-label">day streak</span>
        </div>
        
        <div className="habit-actions">
          <button
            className={`btn-track ${isCompletedToday ? 'completed' : ''}`}
            onClick={handleToggle}
          >
            {isCompletedToday ? 'Completed' : 'Mark Complete'}
          </button>
          
          <button className="btn-view" onClick={onView}>
            View Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitItem;