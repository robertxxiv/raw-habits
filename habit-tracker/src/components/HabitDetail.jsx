import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitCalendar from './HabitCalendar';
import { getCalendarDates, getMonthName } from '../utils/dateUtils';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

const HabitDetail = ({ habit, onClose }) => {
  const { calculateStreak, calculateCompletionRate } = useHabits();
  const [activeTab, setActiveTab] = useState('calendar');
  
  const { current: currentStreak, longest: longestStreak } = calculateStreak(habit.id);
  const weeklyCompletion = calculateCompletionRate(habit.id, 'week');
  const monthlyCompletion = calculateCompletionRate(habit.id, 'month');
  
  // Prepare data for the weekly chart
  const calendarDates = getCalendarDates();
  const weeklyData = [];
  
  // Group by week and count completions
  for (let i = 0; i < 12; i++) {
    const weekStart = i * 7;
    const weekDates = calendarDates.slice(weekStart, weekStart + 7);
    const weekStartDate = weekDates[0]?.date;
    
    if (weekStartDate) {
      const completions = weekDates.filter(({ date }) => 
        habit.entries.some(entry => entry.date === date && entry.value)
      ).length;
      
      weeklyData.push({
        week: `W${i+1}`,
        completions,
        weekOf: getMonthName(weekStartDate).substring(0, 3),
      });
    }
  }
  
  return (
    <div className="modal-overlay">
      <div className="habit-detail-modal">
        <div className="modal-header" style={{ backgroundColor: habit.color }}>
          <div className="habit-detail-title">
            <span className="habit-icon">{habit.icon}</span>
            <h2>{habit.name}</h2>
          </div>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="habit-stats">
          <div className="stat-card">
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{weeklyCompletion}%</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{monthlyCompletion}%</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
        
        <div className="habit-tabs">
          <button 
            className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'calendar' ? (
            <div className="calendar-container">
              <HabitCalendar 
                habitId={habit.id} 
                color={habit.color}
              />
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={weeklyData} 
                  margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value, index) => `${weeklyData[index]?.weekOf}`}
                  />
                  <YAxis 
                    domain={[0, 7]} 
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} days`, 'Completed']}
                    labelFormatter={(value, payload) => 
                      `Week of ${payload[0]?.payload?.weekOf}`
                    }
                  />
                  <Bar 
                    dataKey="completions" 
                    fill={habit.color} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitDetail;