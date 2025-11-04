# CSS Naming Convention

## Overview

All custom CSS classes in this project use the `sorath-` prefix to avoid conflicts with third-party libraries (like Bootstrap) and ensure consistent styling across the application.

## Naming Pattern

```
sorath-{component}-{element}-{modifier}
```

### Examples:

- `.sorath-login-page` - Main login page container
- `.sorath-login-card` - Login card component
- `.sorath-login-title` - Login page title
- `.sorath-form-control` - Custom form input styling
- `.sorath-btn-primary` - Primary button styling
- `.sorath-forgot-password-link` - Link styling

## Component-Specific Classes

### Login Page
- `.sorath-login-page` - Main page container
- `.sorath-login-container` - Container wrapper
- `.sorath-login-wrapper` - Content wrapper
- `.sorath-login-card` - Login form card
- `.sorath-login-title` - Welcome title
- `.sorath-login-subtitle` - Subtitle text

### Logo
- `.sorath-logo-container` - Logo container
- `.sorath-logo` - Logo circle/icon
- `.sorath-logo-text` - Logo text

### Form Elements
- `.sorath-form-label` - Form label styling
- `.sorath-form-control` - Input field styling
- `.sorath-form-check-input` - Checkbox/radio styling

### Buttons
- `.sorath-btn-primary` - Primary button
- `.sorath-btn-secondary` - Secondary button (if needed)

### Links
- `.sorath-forgot-password-link` - Forgot password link
- `.sorath-signup-link` - Sign up link
- `.sorath-signup-text` - Sign up text wrapper

### Alerts
- `.sorath-alert-danger` - Danger alert styling
- `.sorath-alert-success` - Success alert (if needed)
- `.sorath-alert-warning` - Warning alert (if needed)

### Theme Toggle
- `.sorath-theme-toggle` - Theme toggle button

## Utility Classes

Utility classes for common styling patterns:

- `.sorath-text-primary` - Primary text color
- `.sorath-text-secondary` - Secondary text color
- `.sorath-text-tertiary` - Tertiary text color
- `.sorath-text-muted` - Muted text color
- `.sorath-bg-primary` - Primary background
- `.sorath-bg-secondary` - Secondary background
- `.sorath-bg-tertiary` - Tertiary background
- `.sorath-border-primary` - Primary border color
- `.sorath-border-light` - Light border color

## Bootstrap Classes

Bootstrap utility classes (like `mb-3`, `p-4`, `d-flex`, `w-100`, etc.) are still used and don't need the prefix. These are framework classes and won't conflict with our custom classes.

## Best Practices

1. **Always use the `sorath-` prefix** for custom classes
2. **Use descriptive names** that clearly indicate the component and element
3. **Follow BEM-like naming** (Block-Element-Modifier) when applicable
4. **Group related styles** in component-specific CSS files
5. **Use CSS variables** from `style.css` for colors and spacing
6. **Keep Bootstrap classes** for layout and spacing utilities

## Example Usage

```jsx
// ✅ Good - Using prefixed custom classes
<div className="sorath-login-page">
  <Card className="sorath-login-card">
    <h2 className="sorath-login-title">Welcome</h2>
    <Form.Control className="sorath-form-control" />
    <Button className="sorath-btn-primary w-100">Submit</Button>
  </Card>
</div>

// ❌ Bad - No prefix (can cause conflicts)
<div className="login-page">
  <Card className="login-card">
    <h2 className="title">Welcome</h2>
  </Card>
</div>
```

## File Organization

- `src/css/style.css` - Global styles and CSS variables
- `src/css/Login.css` - Login page specific styles
- `src/css/App.css` - App component styles
- `src/css/ThemeToggle.css` - Theme toggle component styles
- Additional component CSS files as needed



