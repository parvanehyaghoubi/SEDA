import { loadVideo, saveVideo } from 'js/localStorage.js';
/* --- DATA ----*/
let videoLibrary = loadVideo();
if (videoLibrary.length === 0) {
    videoLibrary = [
        { id: 'v1', title: "ساخت رمزهای عبور قوی و به‌یادماندنی", duration: "۳:۲۳", description: "این ویدیو نکاتی کاربردی برای ایجاد رمزهایی ارائه می‌دهد که هم قوی هستند و هم به آسانی فراموش نمی‌شوند.", thumbnail: "https://i.pinimg.com/736x/ba/7d/02/ba7d02b3f0fa3005ca5ab46fd28cffeb.jpg", embed: "https://www.youtube.com/embed/3f0u-vw58A0?si=P_g01C6daYM-pcnB" },
        { id: 'v2', title: "روش‌های ایمن‌سازی حساب جیمیل", duration: "۴:۳۰", description: "در این آموزش، گام‌به‌گام با روش‌های ساده و مؤثر برای افزایش امنیت حساب جیمیل خود آشنا می‌شوید.", thumbnail: "https://i.pinimg.com/1200x/38/75/2c/38752c0b7dbce2344ae3ad72a1838045.jpg", embed: "https://www.youtube.com/embed/wOU6e6NNlvY?si=iRozFmU7YQ3ZLyul" },
        { id: 'v3', title: "مبانی امنیت سایبری", duration: "۱۵:۰۲", description: "این ویدیو مفاهیم اصلی امنیت سایبری را معرفی می‌کند و نشان می‌دهد چگونه می‌توان از تهدیدات آنلاین محافظت کرد.", thumbnail: "https://img.youtube.com/vi/5MMoxyK1Y9o/maxresdefault.jpg", embed: "https://www.youtube.com/embed/FomJTL4gjn0?si=OXqdS8gREC1r4HYC" },
        { id: 'v4', title: "جلوگیری از اشتباهات متداول در رمز عبور", duration: "۶:۴۵", description: "در این ویدیو می‌آموزید چگونه از اشتباهات رایج ..هنگام ساخت یا استفاده از رمز عبور جلوگیری کنید تا امنیت حساب‌های شما افزایش یابد.", thumbnail: "https://i.pinimg.com/736x/45/05/46/45054604b7873b602df111c3af7a53ed.jpg", embed: "https://www.youtube.com/embed/SuIyUsmp5dw?si=BskKB4evWG5jGiw2" },
        { id: 'v5', title: "VPN چیست و چگونه از شما در فضای آنلاین محافظت می‌کند", duration: "۷:۱۱", description: "در این ویدیو یاد می‌گیرید که VPN (شبکه خصوصی مجازی) چیست و چگونه به محافظت از اطلاعات شخصی شما در اینترنت کمک می‌کند. این ویدیو توضیح می‌دهد که VPN چگونه آدرس IP شما را پنهان می‌کند.", thumbnail: "https://i.pinimg.com/736x/37/b6/49/37b6493cd794652f3cc5a151226456ab.jpg", embed: "https://www.youtube.com/embed/R-JUOpCgTZc?si=gxsyYxSF7LcJqs1d" }
    ];
    saveVideo(videoLibrary);
}

        /* ----------DOM ---------- */
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const playerWrapper = document.getElementById('playerWrapper');
const playerTitle = document.getElementById('playerTitle');
const playerMeta = document.getElementById('playerMeta');
const playerDesc = document.getElementById('playerDesc');
const suggestedRow = document.getElementById('suggestedRow');
const libraryGrid = document.getElementById('libraryGrid');
const seeMoreBtn = document.getElementById('seeMoreBtn');


/* ---------- AUTO PLAY if selected from library ---------- */
// Check if a video was clicked from the library
const savedVideo = localStorage.getItem('currentVideo');
if (savedVideo) {
    try {
        const video = JSON.parse(savedVideo);
        setTimeout(() => {   // small delay ensures DOM is ready
            playVideo(video);
        }, 50);
        localStorage.removeItem('currentVideo'); // clear after playing
    } catch (e) {
        console.error('Failed to load saved video:', e);
    }
}

/* ---------- RENDER helpers ---------- */
function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function shortText(s, n = 100) { return s?.length > n ? s.slice(0, n - 1) + '…' : s; }

function makeCard(video) {
    const div = document.createElement('div'); div.className = 'card';
    div.innerHTML = `
            <img src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}">
            <div class="info text-end">
            <h3>${escapeHTML(video.title)}</h3>
            <div class="dur text-end">${escapeHTML(video.duration)}</div>
            <p class="text-end">${escapeHTML(shortText(video.description, 120))}</p>
            </div>
        `;
    div.addEventListener('click', () => playVideo(video));
    return div;
}

function makeSuggestCard(video) {
    const div = document.createElement('div'); div.className = 'suggest-card';
    div.innerHTML = `<img src="${escapeHTML(video.thumbnail)}"><div class="smeta"><h4>${escapeHTML(video.title)}</h4><p>${escapeHTML(video.duration)}</p></div>`;
    div.addEventListener('click', () => playVideo(video));
    return div;
}

/* ---------- PLAY VIDEO ---------- */
function playVideo(video) {
    playerWrapper.classList.add('expanded');
    playerWrapper.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = `${video.embed}?autoplay=1&modestbranding=1&rel=0&controls=1`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.loading = 'lazy';
    iframe.addEventListener('load', () => iframe.classList.add('loaded'));
    playerWrapper.appendChild(iframe);

    playerTitle.textContent = video.title;
    playerMeta.textContent = 'مدت ' + video.duration;
    playerDesc.textContent = video.description;

    const idx = videoLibrary.findIndex(v => v.id === video.id);
    if (idx > 0) {
        const [picked] = videoLibrary.splice(idx, 1);
        videoLibrary.unshift(picked);
        saveVideo(videoLibrary);
        renderSuggested();
        renderLibrary(seeMoreBtn.dataset.showing === 'all');
    }
}

/* ---------- initial render ---------- */
function renderSuggested() {
    suggestedRow.innerHTML = '';
    videoLibrary.slice(0, 4).forEach(v => suggestedRow.appendChild(makeSuggestCard(v)));
}

function renderLibrary(showAll = false) {
    if (!libraryGrid) return; // skip if libraryGrid not on this page
    libraryGrid.innerHTML = '';
    const items = showAll ? videoLibrary : videoLibrary.slice(4,8);
    items.forEach(v => libraryGrid.appendChild(makeCard(v)));
}
renderSuggested();
renderLibrary(false);

/* ---------- SEARCH ---------- */
function normalizeWords(s) {
    return s.toLowerCase().split(/\s+/).map(x => x.trim()).filter(Boolean);
}
function searchVideos(query) {
    if (!query) return videoLibrary.slice();
    const qWords = normalizeWords(query);
    return videoLibrary.filter(v => {
        const combined = (v.title + ' ' + v.description).toLowerCase();
        return qWords.every(qw => combined.includes(qw));
    });
}
function showResults(list) {
    resultsGrid.innerHTML = '';
    if (list.length === 0) {
        playerWrapper.classList.remove('expanded');
        playerWrapper.innerHTML = '<div class="player-empty">نتیجه‌ای یافت نشد. جستجوی دیگری را امتحان کنید.</div>';
        playerTitle.textContent = ''; playerMeta.textContent = ''; playerDesc.textContent = '';
    } else {
        list.forEach(v => resultsGrid.appendChild(makeCard(v)));
    }
}
searchInput.addEventListener('input', e => {
    const q = e.target.value.trim();
    showResults(searchVideos(q));
});

/* ---------- SEE MORE ---------- */
if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
        const showing = seeMoreBtn.dataset.showing === 'all';
        if (showing) {
            renderLibrary(false);
        } else {
            window.location.href = 'library.html';
        }
    });
}

/* ---------- initial state ---------- */
playerWrapper.innerHTML = '<div class="player-empty">جستجو کنید یا روی یک ویدیو کلیک کنید تا اینجا پخش شود.</div>';
searchInput.value = '';
resultsGrid.innerHTML = '';
