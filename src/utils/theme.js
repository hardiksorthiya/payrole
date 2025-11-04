/**
 * Theme Utility Functions
 * For managing dark/light mode
 */

/**
 * Get current theme from localStorage, default to light mode
 * @returns {string} 'light' or 'dark'
 */
export const getTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Default to light mode
  return 'light';
};

/**
 * Set theme in localStorage and apply to document
 * @param {string} theme - 'light' or 'dark'
 */
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Initialize theme on app load
 */
export const initTheme = () => {
  const theme = getTheme();
  setTheme(theme);
};

/**
 * Toggle between light and dark mode
 * @returns {string} The new theme
 */
export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};



