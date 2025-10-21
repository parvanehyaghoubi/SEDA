let videoLibrary = [
    { id: 'v1', title: "ساخت رمزهای عبور قوی و به‌یادماندنی", duration: "۳:۲۳", description: "این ویدیو نکاتی کاربردی برای ایجاد رمزهایی ارائه می‌دهد که هم قوی هستند و هم به آسانی فراموش نمی‌شوند.", thumbnail: "https://i.pinimg.com/736x/ba/7d/02/ba7d02b3f0fa3005ca5ab46fd28cffeb.jpg", embed: "https://www.youtube.com/embed/3f0u-vw58A0?si=P_g01C6daYM-pcnB" },
    { id: 'v2', title: "روش‌های ایمن‌سازی حساب جیمیل", duration: "۴:۳۰", description: "در این آموزش، گام‌به‌گام با روش‌های ساده و مؤثر برای افزایش امنیت حساب جیمیل خود آشنا می‌شوید.", thumbnail: "https://i.pinimg.com/1200x/38/75/2c/38752c0b7dbce2344ae3ad72a1838045.jpg", embed: "https://www.youtube.com/embed/wOU6e6NNlvY?si=iRozFmU7YQ3ZLyul" },
    { id: 'v3', title: "مبانی امنیت سایبری", duration: "۱۵:۰۲", description: "این ویدیو مفاهیم اصلی امنیت سایبری را معرفی می‌کند و نشان می‌دهد چگونه می‌توان از تهدیدات آنلاین محافظت کرد.", thumbnail: "https://img.youtube.com/vi/5MMoxyK1Y9o/maxresdefault.jpg", embed: "https://www.youtube.com/embed/FomJTL4gjn0?si=OXqdS8gREC1r4HYC" },
    { id: 'v4', title: "جلوگیری از اشتباهات متداول در رمز عبور", duration: "۶:۴۵", description: "در این ویدیو می‌آموزید چگونه از اشتباهات رایج ..هنگام ساخت یا استفاده از رمز عبور جلوگیری کنید تا امنیت حساب‌های شما افزایش یابد.", thumbnail: "https://i.pinimg.com/736x/45/05/46/45054604b7873b602df111c3af7a53ed.jpg", embed: "https://www.youtube.com/embed/SuIyUsmp5dw?si=BskKB4evWG5jGiw2" },
    { id: 'v5', title: "Recognizing Phishing Attempts", duration: "۹:۰۵", description: "How to spot phishing emails and fake login pages.", thumbnail: "https://i.pinimg.com/736x/37/b6/49/37b6493cd794652f3cc5a151226456ab.jpg", embed: "https://www.youtube.com/embed/R-JUOpCgTZc?si=gxsyYxSF7LcJqs1d" }
];

/* ---------- DOM ---------- */
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const playerWrapper = document.getElementById('playerWrapper');
const playerTitle = document.getElementById('playerTitle');
const playerMeta = document.getElementById('playerMeta');
const playerDesc = document.getElementById('playerDesc');
const playerEmpty = document.getElementById('playerEmpty');
const suggestedRow = document.getElementById('suggestedRow');
const libraryGrid = document.getElementById('libraryGrid');
const seeMoreBtn = document.getElementById('seeMoreBtn');

const navPlay = document.getElementById('nav-play');
const navLibrary = document.getElementById('nav-library-link');
const navHome = document.getElementById('nav-home');
const navAdd = document.getElementById('nav-add');

const addVideoSection = document.getElementById('addVideoSection');
const inputThumb = document.getElementById('inputThumb');
const inputTitle = document.getElementById('inputTitle');
const inputDuration = document.getElementById('inputDuration');
const inputURL = document.getElementById('inputURL');
const inputDesc = document.getElementById('inputDesc');
const thumbPreview = document.getElementById('thumbPreview');
const saveVideoBtn = document.getElementById('saveVideoBtn');

/* ---------- RENDER helpers ---------- */
function escapeHTML(str) { return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function shortText(s, n = 100) { if (!s) return ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }

/* create card (block layout: img on top, content under) */
function makeCard(video) {
    const div = document.createElement('div'); div.className = 'card';
    div.innerHTML = `
    <img src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}">
    <div class="info">
        <h3>${escapeHTML(video.title)}</h3>
        <div class="dur">${escapeHTML(video.duration)}</div>
        <p>${escapeHTML(shortText(video.description, 120))}</p>
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

/* ---------- initial render ---------- */
function renderSuggested() {
    suggestedRow.innerHTML = '';
    videoLibrary.slice(0, 4).forEach(v => suggestedRow.appendChild(makeSuggestCard(v)));
}
function renderLibrary(showAll = false) {
    libraryGrid.innerHTML = '';
    const items = showAll ? videoLibrary : videoLibrary.slice(0, 4);
    items.forEach(v => libraryGrid.appendChild(makeCard(v)));
    seeMoreBtn.textContent = showAll ? 'Show less' : 'مشاهده بیشتر';
    seeMoreBtn.dataset.showing = showAll ? 'all' : 'partial';
}
renderSuggested();
renderLibrary(false);

/* ---------- SEARCH ---------- */
/* normalize words: split and trim */
function normalizeWords(s) {
    return s.toLowerCase().split(/\s+/).map(x => x.trim()).filter(Boolean);
}
/* search: ensure every query word appears in title or description */
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
        // show "no results" inside player
        playerWrapper.classList.remove('expanded');
        playerWrapper.innerHTML = '<div class="player-empty">No results found. Try a different search.</div>';
        playerTitle.textContent = ''; playerMeta.textContent = ''; playerDesc.textContent = '';
    } else {
        // render cards
        list.forEach(v => resultsGrid.appendChild(makeCard(v)));
        // do not auto-play; keep player as is
    }
}

/* input listener */
searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    const found = searchVideos(q);
    showResults(found);
});

/* ---------- PLAY VIDEO ---------- */
function playVideo(video) {
    // expand player and insert iframe
    playerWrapper.classList.add('expanded');
    playerWrapper.innerHTML = ''; // clear
    const iframe = document.createElement('iframe');
    iframe.src = `${video.embed}?autoplay=1&modestbranding=1&rel=0&controls=1`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.setAttribute('loading', 'lazy');
    iframe.addEventListener('load', () => iframe.classList.add('loaded'));
    playerWrapper.appendChild(iframe);

    // update info
    playerTitle.textContent = video.title;
    playerMeta.textContent = 'مدت' + ' ' + video.duration;
    playerDesc.textContent = video.description;

    // no search action required — update suggested (move played video to front)
    const idx = videoLibrary.findIndex(v => v.id === video.id);
    if (idx > 0) { // move to front
        const [picked] = videoLibrary.splice(idx, 1);
        videoLibrary.unshift(picked);
        renderSuggested();
        renderLibrary(seeMoreBtn.dataset.showing === 'all');
    }
}
playerWrapper.innerHTML = '<div id="playerEmpty" class="player-empty">Search or click a video to play it here.</div>';
searchInput.value = '';
resultsGrid.innerHTML = ''; // empty initially

/* expose for debugging (optional) */
window._vp = { videoLibrary, playVideo, searchVideos };