/**
 * Progress.js - Logic for calculating subject progress
 * Direct translation of the Python script 'calculo_progresso.py'
 */

/**
 * Calculates the percentage of completion based on an array of tasks.
 * @param {Array} tasks - Array of task objects with property 'is_completed'
 * @returns {Number} - Float representing the progress percentage (0.0 to 100.0)
 */
function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) {
    return 0.0;
  }

  const totalTasks = tasks.length;
  let completedTasks = 0;

  for (let task of tasks) {
    if (task.is_completed === true) {
      completedTasks++;
    }
  }

  const progress = (completedTasks / totalTasks) * 100;
  // Round to 2 decimal places
  return Math.round(progress * 100) / 100;
}

window.calculateProgress = calculateProgress;
