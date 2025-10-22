    let videoLibrary = JSON.parse(localStorage.getItem('videoLibrary') || '[]');

    const navAdd = document.getElementById('nav-add');
    const addVideoSection = document.getElementById('addVideoSection');
    const searchInput = document.getElementById('searchInput');
    const resultsGrid = document.getElementById('resultsGrid');
    const inputThumb = document.getElementById('inputThumb');
    const inputTitle = document.getElementById('inputTitle');
    const inputDuration = document.getElementById('inputDuration');
    const inputURL = document.getElementById('inputURL');
    const inputDesc = document.getElementById('inputDesc');
    const thumbPreview = document.getElementById('thumbPreview');
    const saveVideoBtn = document.getElementById('saveVideoBtn');

    navAdd.addEventListener('click', e => { e.preventDefault(); attemptAdminOpen(); });

    /* Navbar add video*/
    function attemptAdminOpen() {
      const user = prompt('Admin username:');
      if (user === null) {
        return;
      }
      const pass = prompt('Admin password:');
      if (pass === null) return;
      if (user === 'CTI' && pass === '35') {
        addVideoSection.style.display = 'block';
      } else {
        alert('Sorry, the Add Video section is only open to the admin.');
      }
    }
    /* Escape HTML */
    function escapeHTML(str) { return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
    function shortText(s, n = 100) { return s?.length > n ? s.slice(0, n - 1) + '…' : s; }

    /* Make a card */
    function makeCard(video) {
      const div = document.createElement('div'); div.className = 'card';
      div.innerHTML = `<img src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}">
    <div class="info text-end">
      <h3 class="text-end">${escapeHTML(video.title)}</h3>
      <div class="dur text-end">${escapeHTML(video.duration)}</div>
      <p class="text-end">${escapeHTML(shortText(video.description, 100))}</p>
    </div>`;
      div.addEventListener('click', () => {
        localStorage.setItem('currentVideo', JSON.stringify(video));
        window.location.href = 'video-section.html';
      });
      return div;
    }

    /* ---------- Video preview ---------- */
    inputURL.addEventListener('input', () => {
      const v = inputURL.value.trim();
      if (v) {
        // Check if it's a full YouTube URL and convert to embed if needed
        let embedURL = v;
        if (v.includes('youtube.com/watch?v=')) {
          const videoId = v.split('v=')[1].split('&')[0];
          embedURL = `${v.embed}`;
        }

        videoPreview.innerHTML = `
      <iframe src="${embedURL}" allowfullscreen></iframe>
    `;
      } else {
        videoPreview.innerHTML = `
      <small style="font-weight:400;color:#ffff;opacity:0.85">
        Upload the video<br>paste embed URL
      </small>
    `;
      }
    });


    /* ---------- Thumbnail preview ---------- */
    inputThumb.addEventListener('input', () => {
      const v = inputThumb.value.trim();
      if (v) {
        thumbPreview.style.backgroundImage = `url(${v})`;
        thumbPreview.style.backgroundSize = 'cover';
        thumbPreview.style.backgroundPosition = 'center';
        thumbPreview.textContent = '';
      } else {
        thumbPreview.style.backgroundImage = 'none';
        thumbPreview.textContent = 'paste the thumbnail URL'
        thumbPreview.style.fontSize = '14px'
      }
    });

    /* ---------- Save video ---------- */

    saveVideoBtn.addEventListener('click', () => {
      const thumb = inputThumb.value.trim();
      const title = inputTitle.value.trim();
      const duration = inputDuration.value.trim();
      const url = inputURL.value.trim();
      const desc = inputDesc.value.trim();

      if (!thumb || !title || !duration || !url) {
        alert('Please fill thumbnail, title, duration and embed URL.');
        return;
      }

      const id = 'v' + Date.now();
      const newVideo = { id, title, duration, description: desc || '', thumbnail: thumb, embed: url };
      videoLibrary.unshift(newVideo);
      saveVideo(videoLibrary);

      inputThumb.value = ''; inputTitle.value = ''; inputDuration.value = ''; inputURL.value = ''; inputDesc.value = '';
      thumbPreview.style.backgroundImage = 'none';
      thumbPreview.textContent = 'Upload the video thumbnail\npaste image URL';
      videoPreview.style.backgroundImage = 'none';
      videoPreview.textContent = 'Upload the video UTL\npaste image URL';

      renderLibrary(false);
      alert('Video saved to library.');
      scrollTo('librarySection');
    });

    /* Render all videos */
    function renderLibrary(showAll = false) {
    if (!libraryGrid) return; // skip if libraryGrid not on this page
    libraryGrid.innerHTML = '';
    const items = showAll ? videoLibrary : videoLibrary.slice(0, 4);
    items.forEach(v => libraryGrid.appendChild(makeCard(v)));
}

    const libraryGrid = document.getElementById('libraryGrid');
    libraryGrid.innerHTML = '';
    videoLibrary.forEach(v => libraryGrid.appendChild(makeCard(v)));

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
      resultsGrid.style.display = 'flex'
      resultsGrid.style.justifyContent = 'center'
      resultsGrid.style.gap = '14px'
      list.forEach(v => resultsGrid.appendChild(makeCard(v)));
    }
    searchInput.addEventListener('input', e => {
      const q = e.target.value.trim();
      showResults(searchVideos(q));
    });
