# CSS Structure

## File Organization

All CSS files are organized in the `src/css/` folder:

- **`style.css`** - Main stylesheet with CSS variables for dark/light mode support
- **`Login.css`** - Login page specific styles
- **`App.css`** - App component specific styles

## Theme System

### CSS Variables

The theme system uses CSS variables defined in `style.css`:

- **Primary Colors**: `--primary-color`, `--primary-color-dark`
- **Background Colors**: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- **Text Colors**: `--text-primary`, `--text-secondary`, `--text-tertiary`
- **Border Colors**: `--border-color`, `--border-color-light`
- **Card Styles**: `--card-bg`, `--card-shadow`
- **Input Styles**: `--input-bg`, `--input-border`, `--input-focus-border`
- **Button Styles**: `--btn-primary-bg`, `--btn-primary-hover-shadow`
- **Link Colors**: `--link-color`, `--link-hover-color`

### Using the Theme

The theme is controlled via the `data-theme` attribute on the `<html>` element:

- **Light Mode**: Default (no attribute or `data-theme="light"`)
- **Dark Mode**: `data-theme="dark"`

### Theme Utilities

Use the theme utility functions from `src/utils/theme.js`:

```javascript
import { getTheme, setTheme, toggleTheme } from '../utils/theme'

// Get current theme
const currentTheme = getTheme()

// Set theme
setTheme('dark')

// Toggle theme
toggleTheme()
```

### Theme Toggle Component

Use the `ThemeToggle` component to add a theme switcher:

```javascript
import ThemeToggle from '../components/ThemeToggle'

// In your component
<ThemeToggle />
```

### Adding New Styles

When adding new components, use CSS variables instead of hardcoded colors:

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

This ensures your components automatically adapt to the selected theme.



