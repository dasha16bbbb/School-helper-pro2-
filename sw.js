const cacheName = 'school-helper-v1';

const isGitHub = self.location.hostname.includes('github.io');
const repo = isGitHub ? `/${self.location.pathname.split('/')[1]}` : '';

const assets = [
    `${repo}/`,
    `${repo}/index.html`,
    `${repo}/tools.html`,
    `${repo}/about.html`,
    `${repo}/style.css`,
    `${repo}/app.js`,
    `${repo}/tools.js`,
    `${repo}/manifest.json`
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request);
        })
    );
});