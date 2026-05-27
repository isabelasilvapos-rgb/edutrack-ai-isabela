/**
 * app.js - Global App Logic (Theme toggling, Auth state, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage for theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
            updateThemeIcon(targetTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }

    // 2. Auth protection (Basic token check)
    // If we are not on index.html, check if token is present
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const token = localStorage.getItem('token');

    if (!isIndexPage && !token) {
        // Redirect to login
        window.location.href = 'index.html';
    }
    
    // 3. Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
});
