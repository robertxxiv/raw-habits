import { useState, useRef } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { exportHabits, importHabits } from '../utils/exportImport';

const Settings = ({ onClose }) => {
  const { habits, loading } = useHabits();
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  // Handle data export
  const handleExport = () => {
    if (loading || habits.length === 0) return;
    
    exportHabits(habits);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection for import
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError('');
    setImportSuccess('');
    
    try {
      const importedHabits = await importHabits(file);
      
      // Replace habits in localStorage
      localStorage.setItem('habits', JSON.stringify(importedHabits));
      
      setImportSuccess('Data imported successfully! Reload the page to see changes.');
      
      // Reset file input
      e.target.value = '';
    } catch (error) {
      setImportError(error.message || 'Failed to import data');
      
      // Reset file input
      e.target.value = '';
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h3>Settings</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h4>Data Management</h4>
            
            <div className="settings-actions">
              <div className="settings-action">
                <button 
                  className="btn-primary"
                  onClick={handleExport}
                  disabled={loading || habits.length === 0}
                >
                  Export Data as JSON
                </button>
                <p className="settings-description">
                  Download all your habit data as a JSON file for backup.
                </p>
              </div>
              
              <div className="settings-action">
                <button 
                  className="btn-primary"
                  onClick={triggerFileInput}
                >
                  Import Data from JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  style={{ display: 'none' }}
                />
                <p className="settings-description">
                  Import habit data from a previously exported JSON file.
                </p>
                {importError && (
                  <p className="error-message">{importError}</p>
                )}
                {importSuccess && (
                  <p className="success-message">{importSuccess}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h4>Display</h4>
            <p className="settings-description">
              Use the dark mode toggle in the header to switch between light and dark themes.
            </p>
          </div>
          
          <div className="settings-section">
            <h4>About</h4>
            <p className="settings-description">
              Habit Tracker App - A simple tool to track your daily habits and visualize your progress.
            </p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;