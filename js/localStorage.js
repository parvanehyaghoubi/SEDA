// localStorage
export function loadVideo() {
try {
    return JSON.parse(localStorage.getItem('videoLibrary')) || [];
} catch {
    return [];
}
}

export function saveVideo(videos) {
    localStorage.setItem('videoLibrary', JSON.stringify(videos));
}
