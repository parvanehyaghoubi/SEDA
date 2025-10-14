const toggleBtn = document.getElementById('themeToggle');
const icon = toggleBtn.querySelector('i');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Popup after 3 seconds
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('popupModal').style.display = 'flex';
    }, 3000);
});

function closePopup() {
    document.getElementById('popupModal').style.display = 'none';
}