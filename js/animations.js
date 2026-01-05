// 1. Initialize AOS Animation
AOS.init({
    duration: 800,
    once: true,
});

// 2. Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Set the correct icon on page load
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

// Add click event listener
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        // Toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // Toggle Dark Mode Class & Save to LocalStorage
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    });
}

// 3. Mobile Menu Logic
const btn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('navbar-sticky');

if (btn && menu) {
    // Toggle menu visibility
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close menu when clicking a link (Better UX)
    const mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
        });
    });
}