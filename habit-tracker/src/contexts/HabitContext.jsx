import { createContext, useContext, useState, useEffect } from 'react';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load habits from localStorage on initial render
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
    setLoading(false);
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, loading]);

  // Add a new habit
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      color: habit.color || '#3498db',
      icon: habit.icon || '📊',
      createdAt: new Date().toISOString(),
      entries: [],
    };
    setHabits([...habits, newHabit]);
    return newHabit;
  };

  // Update an existing habit
  const updateHabit = (id, updatedData) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, ...updatedData } : habit
      )
    );
  };

  // Delete a habit
  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  // Track a habit for a specific date (default to today)
  const trackHabit = (id, date = new Date().toISOString().split('T')[0], value = true) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          // Check if entry for this date already exists
          const existingEntryIndex = habit.entries.findIndex(
            (entry) => entry.date === date
          );

          let updatedEntries;
          if (existingEntryIndex >= 0) {
            // Update existing entry
            updatedEntries = [...habit.entries];
            updatedEntries[existingEntryIndex] = {
              ...updatedEntries[existingEntryIndex],
              value,
            };
          } else {
            // Add new entry
            updatedEntries = [...habit.entries, { date, value }];
          }

          return {
            ...habit,
            entries: updatedEntries,
          };
        }
        return habit;
      })
    );
  };

  // Calculate current streak for a habit
  const calculateStreak = (habitId) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return { current: 0, longest: 0 };

    const sortedEntries = [...habit.entries]
      .filter((entry) => entry.value)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedEntries.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 1;
    let longestStreak = 1;
    let streakBreak = false;

    // Check if most recent entry is today or yesterday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mostRecentDate = new Date(sortedEntries[0].date);
    const daysSinceLastEntry = Math.floor(
      (today - mostRecentDate) / (1000 * 60 * 60 * 24)
    );

    // If last entry is more than 1 day ago, streak is broken
    if (daysSinceLastEntry > 1) {
      currentStreak = 0;
    } else {
      // Calculate streaks
      for (let i = 0; i < sortedEntries.length - 1; i++) {
        const currentDate = new Date(sortedEntries[i].date);
        const nextDate = new Date(sortedEntries[i + 1].date);
        
        // Calculate difference in days
        const diffTime = currentDate - nextDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive days
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (diffDays > 1) {
          // Streak broken
          if (!streakBreak) {
            streakBreak = true;
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
          }
        }
      }
    }

    return { current: currentStreak, longest: longestStreak };
  };

  // Calculate completion percentage for a time period
  const calculateCompletionRate = (habitId, period = 'week') => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;

    const today = new Date();
    let startDate = new Date();

    // Set the start date based on the period
    if (period === 'week') {
      // Get start of current week (Sunday)
      const day = today.getDay();
      startDate.setDate(today.getDate() - day);
    } else if (period === 'month') {
      // Get start of current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    startDate.setHours(0, 0, 0, 0);

    // Calculate the total days in the period
    const totalDays = period === 'week' ? 7 : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Filter entries in the period
    const entriesInPeriod = habit.entries.filter(
      (entry) => new Date(entry.date) >= startDate && entry.value
    );

    return Math.round((entriesInPeriod.length / totalDays) * 100);
  };

  const value = {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    trackHabit,
    calculateStreak,
    calculateCompletionRate,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};