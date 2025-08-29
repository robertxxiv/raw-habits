import { useState, useEffect } from 'react';
import { useHabits } from '../contexts/HabitContext';

const COLORS = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Yellow
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#e67e22', // Orange
  '#34495e', // Dark Blue
];

const ICONS = ['📊', '🏃', '💧', '📖', '🧘', '🍎', '💪', '✍️', '🛌', '🚴'];

const HabitForm = ({ onClose, habitToEdit }) => {
  const { addHabit, updateHabit, deleteHabit } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    color: COLORS[0],
    icon: ICONS[0],
  });
  const [errors, setErrors] = useState({});

  // If we're editing a habit, populate the form
  useEffect(() => {
    if (habitToEdit) {
      setFormData({
        name: habitToEdit.name,
        color: habitToEdit.color,
        icon: habitToEdit.icon,
      });
    }
  }, [habitToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit the form
    if (habitToEdit) {
      updateHabit(habitToEdit.id, formData);
    } else {
      addHabit(formData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (habitToEdit && window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabit(habitToEdit.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="habit-form-modal">
        <div className="modal-header">
          <h3>{habitToEdit ? 'Edit Habit' : 'Create New Habit'}</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="habit-name">Habit Name</label>
            <input
              type="text"
              id="habit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="What habit do you want to track?"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label>Select Color</label>
            <div className="color-options">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Select Icon</label>
            <div className="icon-options">
              {ICONS.map((icon) => (
                <div
                  key={icon}
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            {habitToEdit && (
              <button
                type="button"
                className="btn-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {habitToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;