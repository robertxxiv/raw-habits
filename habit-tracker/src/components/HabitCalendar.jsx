import { useHabits } from '../contexts/HabitContext';
import { getCalendarDates, groupByWeek, getToday } from '../utils/dateUtils';

const HabitCalendar = ({ habitId, color }) => {
  const { habits } = useHabits();
  const habit = habits.find(h => h.id === habitId);
  
  if (!habit) return null;

  // Get dates for the calendar (last 12 weeks)
  const calendarDates = getCalendarDates();
  const weeks = groupByWeek(calendarDates);
  const today = getToday();
  
  // Day labels for the first column
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Function to get cell color based on completion
  const getCellColor = (date) => {
    if (!date) return 'transparent';
    
    const isCompleted = habit.entries.some(
      entry => entry.date === date && entry.value
    );
    
    if (isCompleted) {
      return color;
    }
    
    return date > today ? '#f5f5f5' : '#eaeaea';
  };
  
  return (
    <div className="habit-calendar">
      <div className="calendar-grid">
        {/* Day labels column */}
        <div className="day-labels">
          {dayLabels.map((day, index) => (
            <div key={day} className="day-label" style={{ gridRow: index + 1 }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar cells */}
        <div className="calendar-weeks">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="calendar-week">
              {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                const dateObj = week.find(d => d.dayOfWeek === dayOfWeek);
                const date = dateObj?.date;
                
                return (
                  <div
                    key={`${weekIndex}-${dayOfWeek}`}
                    className="calendar-day"
                    style={{ 
                      backgroundColor: getCellColor(date),
                      opacity: date ? 1 : 0
                    }}
                    title={date}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="month-labels">
        {/* Generate month labels */}
        {weeks.filter((_, i) => i % 4 === 0).map((week, i) => {
          const firstDateInWeek = week.find(d => d.date)?.date;
          if (!firstDateInWeek) return null;
          
          const month = new Date(firstDateInWeek).toLocaleString('default', { month: 'short' });
          
          return (
            <div key={`month-${i}`} className="month-label" style={{ left: `${i * 25}%` }}>
              {month}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCalendar;