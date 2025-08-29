import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitForm from './HabitForm';
import HabitItem from './HabitItem';
import { getToday } from '../utils/dateUtils';

const HabitList = ({ onSelectHabit }) => {
  const { habits, loading } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  if (loading) {
    return <div className="loading">Loading habits...</div>;
  }

  return (
    <div className="habit-list-container">
      <div className="habit-list-header">
        <h2>My Habits</h2>
        <button 
          className="btn-add" 
          onClick={() => setShowForm(true)}
        >
          + New Habit
        </button>
      </div>

      {showForm && (
        <HabitForm 
          onClose={handleFormClose} 
          habitToEdit={editingHabit} 
        />
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any habits yet.</p>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(true)}
          >
            Create your first habit
          </button>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.map((habit) => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              onEdit={() => handleEdit(habit)}
              onView={() => onSelectHabit(habit)}
              today={getToday()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitList;